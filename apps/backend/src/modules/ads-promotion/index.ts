import { Module } from '@medusajs/framework/utils'

import AdsPromotionModuleService from './service'

export const ADS_PROMOTION_MODULE = 'adsPromotionModuleService'

export default Module(ADS_PROMOTION_MODULE, {
  service: AdsPromotionModuleService
})