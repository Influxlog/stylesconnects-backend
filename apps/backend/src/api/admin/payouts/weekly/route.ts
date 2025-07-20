import { MedusaRequest, MedusaResponse } from '@medusajs/framework'

import { processWeeklyPayoutsWorkflow } from '../../../../workflows/payout/workflows/process-weekly-payouts'

export const POST = async (
  req: MedusaRequest<{
    start_date: string
    end_date: string
    currency_code?: string
  }>,
  res: MedusaResponse
) => {
  const { start_date, end_date, currency_code = 'NGN' } = req.body

  const { result } = await processWeeklyPayoutsWorkflow(req.scope).run({
    input: {
      start_date,
      end_date,
      currency_code
    }
  })

  res.json({
    message: 'Weekly payouts processed successfully',
    ...result
  })
}
