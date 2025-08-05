import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'
import { createAdsPromotionWorkflow } from '../../../workflows/ads-promotion/workflows'
import { VendorCreateAdsPromotionType } from './validators'

/**
 * @oas [get] /vendor/ads-promotion
 * operationId: "VendorListAdsPromotions"
 * summary: "List seller's ads promotions"
 * description: "Retrieves seller's ads promotions"
 * x-authenticated: true
 */
export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: ads_promotions } = await query.graph({
    entity: 'ads_promotion',
    fields: ['*'],
    filters: { seller_id: req.filterableFields.seller_id }
  })

  res.json({ ads_promotions })
}

/**
 * @oas [post] /vendor/ads-promotion
 * operationId: "VendorCreateAdsPromotion"
 * summary: "Create ads promotion"
 * description: "Creates new ads promotion request"
 * x-authenticated: true
 */
export async function POST(
  req: AuthenticatedMedusaRequest<VendorCreateAdsPromotionType>,
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