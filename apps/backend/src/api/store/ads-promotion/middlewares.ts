import {
  MiddlewareRoute,
  validateAndTransformQuery
} from '@medusajs/framework'

import { StoreGetAdsPromotionsParams } from './validators'

export const storeAdsPromotionMiddlewares: MiddlewareRoute[] = [
  {
    method: ['GET'],
    matcher: '/store/ads-promotion',
    middlewares: [
      validateAndTransformQuery(StoreGetAdsPromotionsParams, {})
    ]
  }
]