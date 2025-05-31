import type { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework/http';



import { STYLEDTOKEN_MODULE } from '../../../modules/styledtoken';
import StyledTokenModuleService from '../../../modules/styledtoken/service';


export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const styledTokenService: StyledTokenModuleService =
    req.scope.resolve(STYLEDTOKEN_MODULE)

  const customerId = req.auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ message: 'Customer not authenticated' })
  }

  try {
    const tokenBalance =
      await styledTokenService.getCustomerTokenBalance(customerId)

    const { offset = 0, limit = 20 } = req.query
    const transactions = await styledTokenService.getCustomerTransactions(
      customerId,
      {
        skip: Number(offset),
        take: Number(limit)
      }
    )

    res.json({
      balance: tokenBalance,
      transactions: transactions[0] || [],
      count: transactions[1] || 0,
      offset: Number(offset),
      limit: Number(limit)
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch token data',
      error: error.message
    })
  }
}