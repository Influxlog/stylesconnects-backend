import { MathBN } from '@medusajs/framework/utils';
import { WorkflowResponse, createWorkflow } from '@medusajs/framework/workflows-sdk';
import { transform } from '@medusajs/framework/workflows-sdk';
import { useQueryGraphStep } from '@medusajs/medusa/core-flows';



import { WeeklyBulkTransferInput, processWeeklyBulkTransferStep } from '../steps/process-weekly-bulk-transfer';


export interface WeeklyPayoutInput {
  start_date: string
  end_date: string
  currency_code: string
}

export const processWeeklyPayoutsWorkflow = createWorkflow(
  'process-weekly-payouts',
  function (input: WeeklyPayoutInput) {
    // Query all captured payments for the period
    const { data: payments } = useQueryGraphStep({
      entity: 'split_order_payment',
      fields: [
        'id',
        'seller_id',
        'captured_amount',
        'refunded_amount',
        'currency_code',
        'order_id'
        // Remove seller fields since they're not directly accessible
      ],
      filters: {
        status: 'captured',
        updated_at: {
          $gte: input.start_date,
          $lte: input.end_date
        }
      }
    }).config({ name: 'query-captured-payments' })

    // Extract unique seller IDs
    const sellerIds = transform({ payments }, ({ payments }) => {
      return [...new Set(payments.map((p) => p.seller_id))]
    })
                                                     
    // Query sellers separately to get paystack_recipient_code and name
    const { data: sellers } = useQueryGraphStep({
      entity: 'seller',
      fields: ['id', 'paystack_recipient_code', 'name'], // Use 'name' instead
      filters: {
        id: sellerIds
      }
    }).config({ name: 'query-sellers' })

    // Extract unique order IDs
    const orderIds = transform({ payments }, ({ payments }) => {
      return [...new Set(payments.map((p) => p.order_id))]
    })

    // Query orders to get item IDs
    const { data: orders } = useQueryGraphStep({
      entity: 'order',
      fields: ['id', 'items.id'],
      filters: {
        id: orderIds
      }
    }).config({ name: 'query-orders-for-items' })

    // Extract item IDs
    const itemIds = transform({ orders }, ({ orders }) => {
      return orders.flatMap((order) => order.items.map((item) => item.id))
    })

    // Query commission lines for all items
    const { data: commissionLines } = useQueryGraphStep({
      entity: 'commission_line',
      fields: ['*'],
      filters: {
        item_line_id: itemIds
      }
    }).config({ name: 'query-commission-lines' })

    // Transform and group payments by seller with commission deduction
    const transferData = transform(
      { payments, commissionLines, orders, sellers, input },
      ({ payments, commissionLines, orders, sellers, input }): WeeklyBulkTransferInput => {
        const sellerPayouts = new Map()

        // Create a mapping from seller_id to seller data
        const sellerMap = new Map()
        for (const seller of sellers) {
          sellerMap.set(seller.id, seller)
        }

        // Create a mapping from item_line_id to order_id
        const itemToOrderMap = new Map()
        for (const order of orders) {
          for (const item of order.items) {
            itemToOrderMap.set(item.id, order.id)
          }
        }

        // Group commission lines by order
        const commissionByOrder = new Map()
        for (const line of commissionLines) {
          const orderId = itemToOrderMap.get(line.item_line_id)
          if (orderId) {
            const existing = commissionByOrder.get(orderId) || MathBN.convert(0)
            commissionByOrder.set(orderId, MathBN.add(existing, line.value))
          }
        }

        for (const payment of payments) {
          const sellerId = payment.seller_id
          const orderId = payment.order_id
          const seller = sellerMap.get(sellerId)

          // Skip if seller data is not found
          if (!seller) {
            console.warn(`Seller data not found for seller_id: ${sellerId}`)
            continue
          }

          // Calculate net payout amount (captured - refunded - commission)
          const capturedAmount = MathBN.convert(payment.captured_amount)
          const refundedAmount = MathBN.convert(payment.refunded_amount || 0)
          const orderCommission =
            commissionByOrder.get(orderId) || MathBN.convert(0)

          const netPayoutAmount = capturedAmount
            .minus(refundedAmount)
            .minus(orderCommission)

          const existing = sellerPayouts.get(sellerId) || {
            total: MathBN.convert(0),
            recipient_code: seller.paystack_recipient_code,
            business_name: seller.name,
            payment_ids: []
          }

          existing.total = MathBN.add(existing.total, netPayoutAmount)
          existing.payment_ids.push(payment.id)
          sellerPayouts.set(sellerId, existing)
        }

        // Convert MathBN totals to numbers for the transfer step
        const finalSellerPayouts: Record<string, {
          total: number
          recipient_code: string
          business_name: string
          payment_ids: string[]
        }> = {}
        for (const [sellerId, data] of sellerPayouts) {
          finalSellerPayouts[sellerId] = {
            ...data,
            total: data.total.toNumber()
          }
        }

        return {
          seller_payouts: finalSellerPayouts,
          currency_code: input.currency_code
        }
      }
    )

    // Process the bulk transfer
    const transferResult = processWeeklyBulkTransferStep(transferData)

    return new WorkflowResponse(transferResult)
  }
)