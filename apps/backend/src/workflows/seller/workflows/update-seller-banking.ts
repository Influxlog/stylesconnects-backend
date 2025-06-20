import {
  createWorkflow,
  WorkflowResponse
} from '@medusajs/framework/workflows-sdk'

import { updateSellerStep } from '../steps'
import { createPaystackSubaccountStep } from '../steps/create-paystack-subaccount'

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
    name: 'update-seller-banking',
  },
  function (input: UpdateSellerBankingInput) {
    // Create Paystack subaccount
    const subaccountResult = createPaystackSubaccountStep({
      seller_id: input.seller_id,
      business_name: input.business_name,
      settlement_bank: input.banking_info.bank_code,
      account_number: input.banking_info.account_number,
      percentage_charge: input.percentage_charge || 2.5, // Default 2.5% platform fee
      primary_contact_email: input.email,
      primary_contact_name: input.banking_info.account_name,
      primary_contact_phone: input.phone
    })

    // Update seller with banking info and Paystack details
    const updatedSeller = updateSellerStep({
      id: input.seller_id,
      banking_info: input.banking_info,
      paystack_subaccount_code: subaccountResult.subaccount_code,
      paystack_subaccount_id: subaccountResult.subaccount_id.toString()
    })

    return new WorkflowResponse({
      seller: updatedSeller,
      subaccount: subaccountResult
    })
  }
)