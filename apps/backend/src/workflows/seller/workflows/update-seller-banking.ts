import {
  WorkflowResponse,
  createWorkflow
} from '@medusajs/framework/workflows-sdk'

import { updateSellerStep } from '../steps'
import { createPaystackSubaccountStep } from '../steps/create-paystack-subaccount'
import { createPaystackTransferRecipientStep } from '../steps/create-paystack-transfer-recipient'

export interface UpdateSellerBankingInput {
  seller_id: string
  banking_info: {
    bank_name: string
    account_number: string
    account_name: string
    bank_code: string
  }
  business_name: string
  email?: string
  phone?: string
  percentage_charge?: number // Platform commission percentage
}

export const updateSellerBankingWorkflow = createWorkflow(
  {
    name: 'update-seller-banking'
  },
  function (input: UpdateSellerBankingInput) {
    // Create Paystack transfer recipient instead of subaccount
    const transferRecipient = createPaystackTransferRecipientStep({
      seller_id: input.seller_id,
      account_name: input.banking_info.account_name,
      account_number: input.banking_info.account_number,
      bank_code: input.banking_info.bank_code,
      currency: 'NGN'
    })

    // Update seller with banking info and transfer recipient details
    const updatedSeller = updateSellerStep({
      id: input.seller_id,
      banking_info: input.banking_info,
      paystack_recipient_code: transferRecipient.recipient_code,
      paystack_recipient_id: transferRecipient.recipient_id.toString()
    })

    return new WorkflowResponse({
      seller: updatedSeller,
      transfer_recipient: transferRecipient
    })
  }
)
