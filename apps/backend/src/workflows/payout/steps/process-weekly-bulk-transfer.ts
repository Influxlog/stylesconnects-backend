import { StepResponse, createStep } from '@medusajs/framework/workflows-sdk';



import { PaystackTransferService } from '../../../modules/payment-paystack/services/paystack-transfer';
import { getSmallestUnit } from '../../../shared/utils';


export interface WeeklyBulkTransferInput {
  seller_payouts: Record<
    string,
    {
      total: number
      recipient_code: string
      business_name: string
      payment_ids: string[]
    }
  >
  currency_code: string
}

export const processWeeklyBulkTransferStep = createStep(
  'process-weekly-bulk-transfer',
  async (input: WeeklyBulkTransferInput, { container }) => {
    const transferService = new PaystackTransferService()

    // Create bulk transfer
    const transfers = Object.entries(input.seller_payouts).map(
      ([sellerId, data]) => ({
        amount: getSmallestUnit(data.total, input.currency_code),
        recipient: data.recipient_code,
        reference: `weekly_payout_${sellerId}_${Date.now()}`,
        reason: `Weekly payout for ${data.business_name}`
      })
    )

    console.log(transfers)

    const bulkTransferResponse = await transferService.initiateBulkTransfer({
      currency: input.currency_code.toUpperCase(),
      source: 'balance',
      transfers
    })

    const result = {
      transfer_code: bulkTransferResponse.data.transfer_code,
      total_transfers: transfers.length,
      total_amount: transfers.reduce((sum, t) => sum + t.amount, 0),
      seller_payouts: input.seller_payouts
    }

    return new StepResponse(result)
  }
)