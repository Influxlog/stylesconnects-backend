import { StepResponse, createStep } from '@medusajs/framework/workflows-sdk'

import { ADS_PROMOTION_MODULE } from '../../../modules/ads-promotion'
import AdsPromotionModuleService from '../../../modules/ads-promotion/service'
import {
  AdsPromotionDTO,
  UpdateAdsPromotionDTO
} from '../../../modules/ads-promotion/types/common'

export const reviewAdsPromotionStep = createStep(
  'review-ads-promotion',
  async (
    input: UpdateAdsPromotionDTO & {
      admin_reviewer_id: string
      admin_review_date: Date
    },
    { container }
  ) => {
    const service =
      container.resolve<AdsPromotionModuleService>(ADS_PROMOTION_MODULE)

    const ads_promotion = (await service.updateAdsPromotions({
      id: input.id,
      status: input.status,
      admin_reviewer_id: input.admin_reviewer_id,
      admin_reviewer_note: input.admin_reviewer_note,
      admin_review_date: input.admin_review_date
    })) as AdsPromotionDTO

    return new StepResponse(ads_promotion, ads_promotion.id)
  }
)
