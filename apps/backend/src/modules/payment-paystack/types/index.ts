export enum PaymentProviderKeys {
  CARD = 'paystack'
}

export type PaystackTransactionOptions = {
  channels?: string[]
  split_code?: string
  subaccount?: string
  transaction_charge?: number
  bearer?: 'account' | 'subaccount'
}

export const ErrorCodes = {
  TRANSACTION_UNEXPECTED_STATE: 'transaction_unexpected_state'
}

export const ErrorTransactionStatus = {
  SUCCESS: 'success',
  FAILED: 'failed',
  ABANDONED: 'abandoned'
}

export interface PaystackSplitConfig {
  type: 'percentage' | 'flat'
  currency: string
  subaccount: string
  share: number
}

export interface PaystackInitializeData {
  amount: number
  email: string
  currency: string
  reference: string
  callback_url?: string
  split?: PaystackSplitConfig[]
  subaccount?: string
  transaction_charge?: number
  bearer?: 'account' | 'subaccount'
}