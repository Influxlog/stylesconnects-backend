import { StepResponse, createStep } from '@medusajs/framework/workflows-sdk'
import { ADS_PROMOTION_MODULE } from '../../../modules/ads-promotion'
import AdsPromotionModuleService from '../../../modules/ads-promotion/service'

export const listAdsPromotionsStep = createStep(
  'list-ads-promotions',
  async (input: { filters?: any; pagination?: any }, { container }) => {
    const service = container.resolve<AdsPromotionModuleService>(ADS_PROMOTION_MODULE)
    
    const ads_promotions = await service.listAdsPromotions(input.filters || {}, {
      skip: input.pagination?.skip || 0,
      take: input.pagination?.take || 50
    })

    return new StepResponse(ads_promotions)
  }
)