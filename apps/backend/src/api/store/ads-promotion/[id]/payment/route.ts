import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework'
import { initiateAdsPromotionPaymentWorkflow } from '../../../../../workflows/ads-promotion/workflows'

/**
 * @oas [post] /store/ads-promotion/{id}/payment
 * operationId: "StoreInitiateAdsPromotionPayment"
 * summary: "Initiate payment for ads promotion"
 * description: "Initiates Paystack payment for ads promotion"
 * x-authenticated: true
 */
export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { result } = await initiateAdsPromotionPaymentWorkflow.run({
    input: {
      ads_promotion_id: req.params.id,
      seller_id: req.filterableFields.seller_id
    },
    container: req.scope
  })

  res.json(result)
}