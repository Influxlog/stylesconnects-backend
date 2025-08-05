import {
  MiddlewareRoute,
  validateAndTransformBody,
  validateAndTransformQuery
} from '@medusajs/framework'

import { filterBySellerId } from '../../../shared/infra/http/middlewares'
import {
  VendorCreateAdsPromotion,
  VendorGetAdsPromotionsParams
} from './validators'

export const vendorAdsPromotionMiddlewares: MiddlewareRoute[] = [
  {
    method: ['GET'],
    matcher: '/vendor/ads-promotion',
    middlewares: [
      validateAndTransformQuery(VendorGetAdsPromotionsParams, {}),
      filterBySellerId()
    ]
  },
  {
    method: ['POST'],
    matcher: '/vendor/ads-promotion',
    middlewares: [
      validateAndTransformBody(VendorCreateAdsPromotion),
      filterBySellerId()
    ]
  },
  {
    method: ['POST'],
    matcher: '/vendor/ads-promotion/:id/payment',
    middlewares: [filterBySellerId()]
  }
]
