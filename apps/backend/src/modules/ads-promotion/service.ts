import { MedusaService } from '@medusajs/framework/utils'
import { AdsPromotion, AdsPricing } from './models'

class AdsPromotionModuleService extends MedusaService({
  AdsPromotion,
  AdsPricing
}) {}

export default AdsPromotionModuleService