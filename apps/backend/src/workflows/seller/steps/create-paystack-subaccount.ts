import { MedusaError } from '@medusajs/framework/utils'
import { StepResponse, createStep } from '@medusajs/framework/workflows-sdk'

import { PaystackSubaccountService } from '../../../modules/payment-paystack/services/paystack-subaccount'

export interface CreatePaystackSubaccountInput {
  seller_id: string
  business_name: string
  settlement_bank: string
  account_number: string
  percentage_charge: number
  primary_contact_email?: string
  primary_contact_name?: string
  primary_contact_phone?: string
}

export interface CreatePaystackSubaccountOutput {
  subaccount_code: string
  subaccount_id: number
  is_verified: boolean
}

export const createPaystackSubaccountStep = createStep(
  'create-paystack-subaccount',
  async (
    input: CreatePaystackSubaccountInput
  ): Promise<StepResponse<unknown, CreatePaystackSubaccountOutput>> => {
    const paystackService = new PaystackSubaccountService()

    // Verify account number first
    const accountVerification = await paystackService.verifyAccountNumber(
      input.account_number,
      input.settlement_bank
    )

    if (!accountVerification.status) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Invalid account details: ${accountVerification.message}`
      )
    }

    // Create subaccount
    const subaccountData = {
      business_name: input.business_name,
      settlement_bank: input.settlement_bank,
      account_number: input.account_number,
      percentage_charge: input.percentage_charge,
      description: `Subaccount for seller ${input.seller_id}`,
      primary_contact_email: input.primary_contact_email,
      primary_contact_name: input.primary_contact_name,
      primary_contact_phone: input.primary_contact_phone,
      metadata: {
        seller_id: input.seller_id,
        account_name: accountVerification.data.account_name
      }
    }

    const response = await paystackService.createSubaccount(subaccountData)

    if (!response.status) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Failed to create subaccount: ${response.message}`
      )
    }

    return new StepResponse({
      subaccount_code: response.data.subaccount_code,
      subaccount_id: response.data.id,
      is_verified: response.data.is_verified
    })
  },
  async (output: CreatePaystackSubaccountOutput) => {
    // Compensation: We could delete the subaccount here if needed
    // For now, we'll leave it as Paystack doesn't charge for unused subaccounts
    console.log(
      `Subaccount ${output.subaccount_code} created but transaction failed`
    )
  }
)
