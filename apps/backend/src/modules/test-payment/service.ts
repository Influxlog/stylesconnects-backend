import { getSmallestUnit } from '#/shared/utils';
import axios, { AxiosInstance } from 'axios';



import { InitiatePaymentInput, InitiatePaymentOutput, Logger } from '@medusajs/framework/types';
import { AbstractPaymentProvider, MedusaError } from '@medusajs/framework/utils';



import { PaystackInitializeData, PaystackTransactionOptions } from '../payment-paystack/types';


type Options = {
  secretKey: string
  publicKey: string
  webhookSecret: string
  baseUrl?: string
}

type InjectedDependencies = {
  logger: Logger
}

class MyPaymentProviderService extends AbstractPaymentProvider<Options> {
  static identifier = 'test-payment'
  protected logger_: Logger
  protected options_: Options
  private readonly client_: AxiosInstance

  get transactionOptions(): PaystackTransactionOptions {
    return {
      channels: ['card'],
      bearer: 'account'
    }
  }

  // assuming you're initializing a client

  constructor(container: InjectedDependencies, options: Options) {
    super(container, options)

    this.logger_ = container.logger
    this.options_ = options

    this.client_ = axios.create({
      baseURL: options.baseUrl || 'https://api.paystack.co',
      headers: {
        Authorization: `Bearer ${options.secretKey}`,
        'Content-Type': 'application/json'
      }
    })
    // TODO initialize your client
  }
  // ...

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

    const transactionData: PaystackInitializeData = {
      amount: getSmallestUnit(amount, currency_code),
      email,
      currency: currency_code.toUpperCase(),
      reference,
      ...this.transactionOptions
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
  private buildError(message: string, error: any) {
    return new MedusaError(
      MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
      `${message}: ${error?.message || error}`
    )
  }
}

export default MyPaymentProviderService