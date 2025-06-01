import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { STYLEDTOKEN_MODULE } from '../../../../../modules/styledtoken'
import StyledTokenModuleService from '../../../../../modules/styledtoken/service'

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const styledTokenService: StyledTokenModuleService = req.scope.resolve(STYLEDTOKEN_MODULE)
  
  const customerId = (req as any).auth_context?.actor_id
  
  if (!customerId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  
  const balance = await styledTokenService.getCustomerTokenBalance(customerId)
  const transactions = await styledTokenService.getCustomerTransactions(customerId, {
    take: 10
  })
  
  res.json({
    balance,
    recent_transactions: transactions
  })
}