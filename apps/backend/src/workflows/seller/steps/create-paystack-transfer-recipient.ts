import { MedusaError } from '@medusajs/framework/utils'
import { StepResponse, createStep } from '@medusajs/framework/workflows-sdk'

import { PaystackTransferService } from '../../../modules/payment-paystack/services/paystack-transfer'

export interface CreatePaystackTransferRecipientInput {
  seller_id: string
  account_name: string
  account_number: string
  bank_code: string
  currency?: string
}

export const createPaystackTransferRecipientStep = createStep(
  'create-paystack-transfer-recipient',
  async (input: CreatePaystackTransferRecipientInput) => {
    const transferService = new PaystackTransferService()

    const recipientData = {
      type: 'nuban' as const,
      name: input.account_name,
      account_number: input.account_number,
      bank_code: input.bank_code,
      currency: input.currency || 'NGN',
      description: `Transfer recipient for seller ${input.seller_id}`,
      metadata: {
        seller_id: input.seller_id
      }
    }

    const response =
      await transferService.createTransferRecipient(recipientData)

    if (!response.status) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Failed to create transfer recipient: ${response.message}`
      )
    }

    return new StepResponse({
      recipient_code: response.data.recipient_code,
      recipient_id: response.data.id
    })
  }
)
