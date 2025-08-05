import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'
import { reviewAdsPromotionWorkflow } from '../../../../workflows/ads-promotion/workflows'
import { AdminReviewAdsPromotionType } from '../validators'

/**
 * @oas [get] /admin/ads-promotion/{id}
 * operationId: "AdminGetAdsPromotion"
 * summary: "Get ads promotion by id"
 * description: "Retrieves an ads promotion by id"
 * x-authenticated: true
 */
export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: [ads_promotion] } = await query.graph({
    entity: 'ads_promotion',
    fields: ['*', 'seller.name', 'seller.email'],
    filters: { id: req.params.id }
  })

  res.json({ ads_promotion })
}

/**
 * @oas [post] /admin/ads-promotion/{id}
 * operationId: "AdminReviewAdsPromotion"
 * summary: "Review ads promotion"
 * description: "Approve or reject ads promotion"
 * x-authenticated: true
 */
export async function POST(
  req: AuthenticatedMedusaRequest<AdminReviewAdsPromotionType>,
  res: MedusaResponse
): Promise<void> {
  const { result: ads_promotion } = await reviewAdsPromotionWorkflow.run({
    input: {
      ...req.validatedBody,
      id: req.params.id,
      admin_reviewer_id: req.auth_context.actor_id,
      admin_review_date: new Date()
    },
    container: req.scope
  })

  res.json({ ads_promotion })
}