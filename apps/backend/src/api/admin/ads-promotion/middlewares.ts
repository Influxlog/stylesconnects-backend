import {
  MiddlewareRoute,
  validateAndTransformBody,
  validateAndTransformQuery
} from '@medusajs/framework'

import {
  AdminCreateAdsPricing,
  AdminUpdateAdsPricing,
  AdminReviewAdsPromotion,
  AdminGetAdsPromotionsParams
} from './validators'

export const adsPromotionMiddlewares: MiddlewareRoute[] = [
  {
    method: ['GET'],
    matcher: '/admin/ads-promotion',
    middlewares: [
      validateAndTransformQuery(AdminGetAdsPromotionsParams, {})
    ]
  },
  {
    method: ['POST'],
    matcher: '/admin/ads-promotion/:id',
    middlewares: [
      validateAndTransformBody(AdminReviewAdsPromotion)
    ]
  },
  {
    method: ['POST'],
    matcher: '/admin/ads-promotion/pricing',
    middlewares: [
      validateAndTransformBody(AdminCreateAdsPricing)
    ]
  },
  {
    method: ['POST'],
    matcher: '/admin/ads-promotion/pricing/:id',
    middlewares: [
      validateAndTransformBody(AdminUpdateAdsPricing)
    ]
  }
]