import axios, { AxiosInstance } from 'axios'
import crypto from 'crypto'

import {
  ProviderWebhookPayload,
  WebhookActionResult
} from '@medusajs/framework/types'
import {
  AbstractPaymentProvider,
  MedusaError,
  PaymentActions,
  PaymentSessionStatus
} from '@medusajs/framework/utils'
import { Logger } from '@medusajs/medusa/types'
import {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput
} from '@medusajs/types'

import {
  getAmountFromSmallestUnit,
  getSmallestUnit
} from '../../../shared/utils'
import {
  PaystackInitializeData,
  PaystackSplitConfig,
  PaystackTransactionOptions
} from '../types'

type Options = {
  secretKey: string
  publicKey: string
  webhookSecret: string
  baseUrl?: string
}

type InjectedDependencies = {
  logger: Logger
}

abstract class PaystackProvider extends AbstractPaymentProvider<Options> {
  private readonly options_: Options
  private readonly client_: AxiosInstance
  private readonly logger_: Logger

  constructor(container: InjectedDependencies, options: Options) {
    super(container)

    this.options_ = options
    this.logger_ = container.logger

    this.client_ = axios.create({
      baseURL: options.baseUrl || 'https://api.paystack.co',
      headers: {
        Authorization: `Bearer ${options.secretKey}`,
        'Content-Type': 'application/json'
      }
    })
  }

  abstract get transactionOptions(): PaystackTransactionOptions

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const reference = input.data?.reference as string

    try {
      const response = await this.client_.get(
        `/transaction/verify/${reference}`
      )
      const transaction = response.data.data
      const dataResponse = transaction as unknown as Record<string, unknown>

      switch (transaction.status) {
        case 'success':
          return { status: PaymentSessionStatus.CAPTURED, data: dataResponse }
        case 'failed':
          return { status: PaymentSessionStatus.ERROR, data: dataResponse }
        case 'abandoned':
          return { status: PaymentSessionStatus.CANCELED, data: dataResponse }
        default:
          return { status: PaymentSessionStatus.PENDING, data: dataResponse }
      }
    } catch (error) {
      throw this.buildError(
        'An error occurred in getPaymentStatus when verifying Paystack transaction',
        error
      )
    }
  }

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    const { amount, currency_code, context } = input
    const email = context?.customer?.email

    if (!email) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'Customer email is required for Paystack payments'
      )
    }

    // Generate unique reference
    const reference = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Calculate split configuration if multiple vendors
    const splitConfig = await this.calculateSplitConfiguration(input)

    const transactionData: PaystackInitializeData = {
      amount: getSmallestUnit(amount, currency_code),
      email,
      currency: currency_code.toUpperCase(),
      reference,
      ...this.transactionOptions,
      ...(splitConfig.length > 0 && { split: splitConfig })
    }

    try {
      const response = await this.client_.post(
        '/transaction/initialize',
        transactionData
      )
      const data = response.data.data

      return {
        id: reference,
        data: {
          ...data,
          reference,
          amount: amount,
          currency: currency_code
        }
      }
    } catch (error) {
      throw this.buildError(
        'An error occurred in initiatePayment when initializing Paystack transaction',
        error
      )
    }
  }

  private async calculateSplitConfiguration(
    input: InitiatePaymentInput
  ): Promise<PaystackSplitConfig[]> {
    // This will be implemented to calculate vendor splits based on cart items
    // For now, return empty array - will be enhanced in the workflow
    return []
  }

  async authorizePayment(
    data: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    // Paystack doesn't have separate authorization step
    // Payment is authorized when transaction is successful
    return this.getPaymentStatus(data)
  }

  async cancelPayment({
    data: paymentSessionData
  }: CancelPaymentInput): Promise<CancelPaymentOutput> {
    // Paystack doesn't support canceling initialized transactions
    // They expire automatically after 15 minutes
    return { data: paymentSessionData }
  }

  async capturePayment({
    data: paymentSessionData
  }: CapturePaymentInput): Promise<CapturePaymentOutput> {
    // Paystack captures payment automatically on successful transaction
    const reference = paymentSessionData?.reference as string

    try {
      const response = await this.client_.get(
        `/transaction/verify/${reference}`
      )
      const transaction = response.data.data

      if (transaction.status === 'success') {
        return { data: transaction }
      }

      throw new MedusaError(
        MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
        `Transaction not successful: ${transaction.status}`
      )
    } catch (error) {
      throw this.buildError('An error occurred in capturePayment', error)
    }
  }

  deletePayment(data: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return this.cancelPayment(data)
  }

  async refundPayment({
    data: paymentSessionData,
    amount
  }: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const reference = paymentSessionData?.reference as string
    const currency = paymentSessionData?.currency as string

    try {
      const refundData = {
        transaction: reference,
        amount: getSmallestUnit(amount, currency)
      }

      await this.client_.post('/refund', refundData)
      return { data: paymentSessionData }
    } catch (error) {
      throw this.buildError('An error occurred in refundPayment', error)
    }
  }

  async retrievePayment({
    data: paymentSessionData
  }: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    try {
      const reference = paymentSessionData?.reference as string
      const response = await this.client_.get(
        `/transaction/verify/${reference}`
      )
      const transaction = response.data.data

      transaction.amount = getAmountFromSmallestUnit(
        transaction.amount,
        transaction.currency.toLowerCase()
      )

      return { data: transaction }
    } catch (error) {
      throw this.buildError('An error occurred in retrievePayment', error)
    }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    // Paystack doesn't support updating initialized transactions
    // Need to create a new transaction
    const newPayment = await this.initiatePayment(input)
    return { data: newPayment.data }
  }

  async getWebhookActionAndData(
    webhookData: ProviderWebhookPayload['payload']
  ): Promise<WebhookActionResult> {
    const event = this.constructWebhookEvent(webhookData)
    const transaction = event.data

    switch (event.event) {
      case 'charge.success':
        return {
          action: PaymentActions.SUCCESSFUL,
          data: {
            session_id: transaction.metadata?.session_id,
            amount: getAmountFromSmallestUnit(
              transaction.amount,
              transaction.currency.toLowerCase()
            )
          }
        }
      case 'charge.failed':
        return {
          action: PaymentActions.FAILED,
          data: {
            session_id: transaction.metadata?.session_id,
            amount: getAmountFromSmallestUnit(
              transaction.amount,
              transaction.currency.toLowerCase()
            )
          }
        }
      default:
        return { action: PaymentActions.NOT_SUPPORTED }
    }
  }

  constructWebhookEvent(data: ProviderWebhookPayload['payload']): any {
    const signature = data.headers['x-paystack-signature'] as string
    const body = data.rawData as string

    const hash = crypto
      .createHmac('sha512', this.options_.webhookSecret)
      .update(body)
      .digest('hex')

    if (hash !== signature) {
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        'Invalid webhook signature'
      )
    }

    return JSON.parse(body)
  }

  private buildError(message: string, error: any) {
    return new MedusaError(
      MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
      `${message}: ${error?.message || error}`
    )
  }
}

export default PaystackProvider