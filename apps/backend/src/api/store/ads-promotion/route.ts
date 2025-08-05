import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse
} from '@medusajs/framework'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

import { createAdsPromotionWorkflow } from '../../../workflows/ads-promotion/workflows'
import { StoreCreateAdsPromotionType } from './validators'

/**
 * @oas [get] /store/ads-promotion
 * operationId: "StoreListActiveAdsPromotions"
 * summary: "List active ads promotions"
 * description: "Retrieves active ads promotions for public display"
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: ads_promotions } = await query.graph({
    entity: 'ads_promotion',
    fields: ['*', 'seller.name', 'seller.handle'],
    filters: {
      status: 'active',
      start_date: { $lte: new Date() },
      end_date: { $gte: new Date() }
    },
    pagination: {
      skip: req.query.offset || 0,
      take: req.query.limit || 10
    }
  })

  res.json({ ads_promotions })
}

/**
 * @oas [post] /store/ads-promotion
 * operationId: "StoreCreateAdsPromotion"
 * summary: "Create ads promotion"
 * description: "Creates new ads promotion request"
 * x-authenticated: true
 */
export async function POST(
  req: AuthenticatedMedusaRequest<StoreCreateAdsPromotionType>,
  res: MedusaResponse
): Promise<void> {
  const { result: ads_promotion } = await createAdsPromotionWorkflow.run({
    input: {
      ...req.validatedBody,
      seller_id: req.filterableFields.seller_id
    },
    container: req.scope
  })

  res.status(201).json({ ads_promotion })
}
