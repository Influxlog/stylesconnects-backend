import { StepResponse, createStep } from '@medusajs/framework/workflows-sdk'
import { ADS_PROMOTION_MODULE } from '../../../modules/ads-promotion'
import AdsPromotionModuleService from '../../../modules/ads-promotion/service'

export const listAdsPricingStep = createStep(
  'list-ads-pricing',
  async (input: { filters?: any; pagination?: any }, { container }) => {
    const service = container.resolve<AdsPromotionModuleService>(ADS_PROMOTION_MODULE)
    
    const ads_pricing = await service.listAdsPricings(input.filters || {}, {
      skip: input.pagination?.offset || 0,
      take: input.pagination?.limit || 50
    })

    return new StepResponse(ads_pricing)
  }
)