import PaystackProvider from '../core/paystack-provider'
import { PaymentProviderKeys, PaystackTransactionOptions } from '../types'

class PaystackCardProviderService extends PaystackProvider {
  static identifier = PaymentProviderKeys.CARD

  constructor(_, options) {
    super(_, options)
  }

  get transactionOptions(): PaystackTransactionOptions {
    return {
      channels: ['card'],
      bearer: 'account'
    }
  }
}

export default PaystackCardProviderService