import { StepResponse, createStep } from '@medusajs/framework/workflows-sdk'

import { ADS_PROMOTION_MODULE } from '../../../modules/ads-promotion'
import AdsPromotionModuleService from '../../../modules/ads-promotion/service'
import { UpdateAdsPricingDTO } from '../../../modules/ads-promotion/types/common'

export const updateAdsPricingStep = createStep(
  'update-ads-pricing',
  async (input: UpdateAdsPricingDTO, { container }) => {
    const service =
      container.resolve<AdsPromotionModuleService>(ADS_PROMOTION_MODULE)

    const ads_pricing: UpdateAdsPricingDTO =
      await service.updateAdsPricings(input)

    return new StepResponse(ads_pricing, ads_pricing.id)
  }
)
