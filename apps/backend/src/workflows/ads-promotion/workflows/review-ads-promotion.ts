import { WorkflowResponse, createWorkflow } from '@medusajs/framework/workflows-sdk'
import { UpdateAdsPromotionDTO } from '../../../modules/ads-promotion/types/common'
import { reviewAdsPromotionStep } from '../steps'

export const reviewAdsPromotionWorkflow = createWorkflow(
  'review-ads-promotion',
  function (input: UpdateAdsPromotionDTO & { admin_reviewer_id: string; admin_review_date: Date }) {
    const ads_promotion = reviewAdsPromotionStep(input)
    return new WorkflowResponse(ads_promotion)
  }
)