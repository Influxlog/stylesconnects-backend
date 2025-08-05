import { StepResponse, createStep } from '@medusajs/framework/workflows-sdk'

import { ADS_PROMOTION_MODULE } from '../../../modules/ads-promotion'
import AdsPromotionModuleService from '../../../modules/ads-promotion/service'
import {
  AdsPricingDTO,
  CreateAdsPricingDTO
} from '../../../modules/ads-promotion/types/common'

export const createAdsPricingStep = createStep(
  'create-ads-pricing',
  async (input: CreateAdsPricingDTO, { container }) => {
    const service =
      container.resolve<AdsPromotionModuleService>(ADS_PROMOTION_MODULE)

    const ads_pricing: AdsPricingDTO = (await service.createAdsPricings({
      ...input,
      currency_code: input.currency_code || 'NGN',
      is_active: true
    })) as AdsPricingDTO

    return new StepResponse(ads_pricing, ads_pricing.id)
  },
  async (ads_pricing_id: string, { container }) => {
    const service =
      container.resolve<AdsPromotionModuleService>(ADS_PROMOTION_MODULE)
    await service.deleteAdsPricings(ads_pricing_id)
  }
)
