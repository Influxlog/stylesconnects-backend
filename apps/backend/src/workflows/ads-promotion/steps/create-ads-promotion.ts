import { StepResponse, createStep } from '@medusajs/framework/workflows-sdk'
import { ADS_PROMOTION_MODULE } from '../../../modules/ads-promotion'
import AdsPromotionModuleService from '../../../modules/ads-promotion/service'
import { CreateAdsPromotionDTO, AdsPromotionDTO } from '../../../modules/ads-promotion/types/common'

export const createAdsPromotionStep = createStep(
  'create-ads-promotion',
  async (input: CreateAdsPromotionDTO, { container }) => {
    const service = container.resolve<AdsPromotionModuleService>(ADS_PROMOTION_MODULE)
    
    // Get pricing for the duration
    const [pricing] = await service.listAdsPricings({
      type: input.type,
      duration_days: input.duration_days,
      is_active: true
    })

    if (!pricing) {
      throw new Error(`No pricing found for ${input.type} ads with ${input.duration_days} days duration`)
    }

    const budget_amount = pricing.price_per_day * input.duration_days
    
    const ads_promotion: AdsPromotionDTO = await service.createAdsPromotions({
      ...input,
      budget_amount,
      status: 'pending_payment'
    })

    return new StepResponse(ads_promotion, ads_promotion.id)
  },
  async (ads_promotion_id: string, { container }) => {
    const service = container.resolve<AdsPromotionModuleService>(ADS_PROMOTION_MODULE)
    await service.deleteAdsPromotions(ads_promotion_id)
  }
)