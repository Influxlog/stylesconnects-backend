import { StepResponse, createStep } from '@medusajs/framework/workflows-sdk'
import {
  ContainerRegistrationKeys,
  MathBN,
  MedusaError
} from '@medusajs/framework/utils'
import axios from 'axios'

import { PaystackSplitConfig } from '../../../modules/payment-paystack/types'
import { getSmallestUnit } from '../../../shared/utils'

export interface PaystackSplitPaymentInput {
  cart_id: string
  payment_collection_id: string
  total_amount: number
  currency_code: string
  customer_email: string
}

export const createPaystackSplitPaymentStep = createStep(
  'create-paystack-split-payment',
  async (input: PaystackSplitPaymentInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    
    // Get cart with seller information
    const { data: cartData } = await query.graph({
      entity: 'cart',
      fields: [
        'id',
        'items.id',
        'items.unit_price',
        'items.quantity',
        'items.variant.product.seller_products.seller_id',
        'items.variant.product.seller_products.seller.paystack_subaccount_code'
      ],
      filters: {
        id: input.cart_id
      }
    })

    const cart = cartData[0]
    if (!cart) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        'Cart not found'
      )
    }

    // Calculate vendor splits
    const vendorTotals = new Map<string, { amount: number; subaccount: string }>()
    let totalItemsAmount = 0

    for (const item of cart.items) {
      const itemTotal = item.unit_price * item.quantity
      totalItemsAmount += itemTotal
      
      const sellerProduct = item.variant.product.seller_products[0]
      if (!sellerProduct) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          'Product seller not found'
        )
      }

      const sellerId = sellerProduct.seller_id
      const subaccountCode = sellerProduct.seller.paystack_subaccount_code
      
      if (!subaccountCode) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Seller ${sellerId} does not have a Paystack subaccount`
        )
      }

      const existing = vendorTotals.get(sellerId) || { amount: 0, subaccount: subaccountCode }
      existing.amount += itemTotal
      vendorTotals.set(sellerId, existing)
    }

    // Get commission rates for each vendor
    const { data: commissionLines } = await query.graph({
      entity: 'commission_line',
      fields: ['*'],
      filters: {
        item_line_id: cart.items.map(item => item.id)
      }
    })

    const totalCommission = commissionLines.reduce(
      (acc, line) => MathBN.add(acc, line.value),
      MathBN.convert(0)
    )

    // Calculate platform commission percentage
    const platformCommissionRate = totalCommission.div(totalItemsAmount).toNumber()

    // Create split configuration
    const splitConfig: PaystackSplitConfig[] = []
    
    for (const [sellerId, { amount, subaccount }] of vendorTotals) {
      const vendorShare = amount - (amount * platformCommissionRate)
      const sharePercentage = (vendorShare / input.total_amount) * 100
      
      splitConfig.push({
        type: 'percentage',
        currency: input.currency_code.toUpperCase(),
        subaccount,
        share: Math.round(sharePercentage * 100) / 100 // Round to 2 decimal places
      })
    }

    // Initialize Paystack transaction with split
    const paystackClient = axios.create({
      baseURL: 'https://api.paystack.co',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const reference = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    try {
      const response = await paystackClient.post('/transaction/initialize', {
        amount: getSmallestUnit(input.total_amount, input.currency_code),
        email: input.customer_email,
        currency: input.currency_code.toUpperCase(),
        reference,
        split: splitConfig,
        metadata: {
          cart_id: input.cart_id,
          payment_collection_id: input.payment_collection_id
        }
      })

      const transactionData = response.data.data

      return new StepResponse({
        reference,
        authorization_url: transactionData.authorization_url,
        access_code: transactionData.access_code,
        split_config: splitConfig
      })
    } catch (error) {
      throw new MedusaError(
        MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
        `Failed to initialize Paystack split payment: ${error.message}`
      )
    }
  }
)