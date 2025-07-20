import { MedusaContainer } from '@medusajs/framework/types'
import { processWeeklyPayoutsWorkflow } from '../workflows/payout/workflows/process-weekly-payouts'

export default async function weeklyPayoutsJob(container: MedusaContainer) {
  // Calculate date range for the past week
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - 7)

  const start_date = startDate.toISOString().split('T')[0]
  const end_date = endDate.toISOString().split('T')[0]

  try {
    const { result } = await processWeeklyPayoutsWorkflow(container).run({
      input: {
        start_date,
        end_date,
        currency_code: 'NGN'
      }
    })

    console.log('Weekly payouts processed successfully:', {
      transfer_code: result.transfer_code,
      total_transfers: result.total_transfers,
      total_amount: result.total_amount
    })
  } catch (error) {
    console.error('Weekly payouts job failed:', error)
    throw error
  }
}

export const config = {
  name: 'weekly-payouts',
  schedule: '0 0 * * 1' // Every Monday at midnight (weekly)
}