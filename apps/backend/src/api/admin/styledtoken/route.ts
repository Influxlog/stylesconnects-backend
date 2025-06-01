import type { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { STYLEDTOKEN_MODULE } from '../../../modules/styledtoken'
import StyledTokenModuleService from '../../../modules/styledtoken/service'
import { AwardTokensDTO } from '#/modules/styledtoken/types'

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const styledTokenService: StyledTokenModuleService = req.scope.resolve(STYLEDTOKEN_MODULE)
  
  const { offset = 0, limit = 20, customer_id } = req.query
  
  const filters: any = {}
  if (customer_id) {
    filters.customer_id = customer_id
  }
  
  const [tokens, count] = await styledTokenService.listAndCountStyledTokens(filters, {
    skip: Number(offset),
    take: Number(limit),
    order: { created_at: 'DESC' }
  })
  
  res.json({
    tokens,
    count,
    offset: Number(offset),
    limit: Number(limit)
  })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const styledTokenService: StyledTokenModuleService = req.scope.resolve(STYLEDTOKEN_MODULE)
  
  const result = await styledTokenService.awardTokens(req.body as AwardTokensDTO)
  
  res.json(result)
}