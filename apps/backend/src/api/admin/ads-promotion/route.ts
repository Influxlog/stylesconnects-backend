import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework'

import { listAdsPromotionsWorkflow } from '../../../workflows/ads-promotion/workflows'

/**
 * @oas [get] /admin/ads-promotion
 * operationId: "AdminListAdsPromotions"
 * summary: "List ads promotions"
 * description: "Retrieves ads promotions list for admin review"
 * x-authenticated: true
 */
export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const {
    result: ads_promotions
  } = await listAdsPromotionsWorkflow.run({
    input: {
      filters: req.filterableFields,
      pagination: {
        skip: req.queryConfig.pagination.skip,
        take: req.queryConfig.pagination.take || 20
      }
    },
    container: req.scope
  })

  res.json({ 
    ads_promotions,
    count: ads_promotions.length,
    offset: req.queryConfig.pagination.skip,
    limit: req.queryConfig.pagination.take
  })
}