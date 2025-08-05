import { z } from 'zod'
import { createFindParams } from '@medusajs/medusa/api/utils/validators'

export type VendorGetAdsPromotionsParamsType = z.infer<typeof VendorGetAdsPromotionsParams>
export const VendorGetAdsPromotionsParams = createFindParams({
  offset: 0,
  limit: 50
}).extend({
  status: z.enum(['draft', 'pending_payment', 'active', 'paused', 'expired', 'rejected']).optional(),
  type: z.enum(['product', 'store']).optional()
})

/**
 * @schema VendorCreateAdsPromotion
 * title: "Create Ads Promotion"
 * description: "Schema for creating ads promotion"
 * x-resourceId: VendorCreateAdsPromotion
 * type: object
 * properties:
 *   type:
 *     type: string
 *     enum: [product, store]
 *     description: Type of ads promotion
 *   target_id:
 *     type: string
 *     description: Product ID for product ads, null for store ads
 *   title:
 *     type: string
 *     description: Title of the ads
 *   description:
 *     type: string
 *     description: Description of the ads
 *   image_url:
 *     type: string
 *     description: Image URL for the ads
 *   duration_days:
 *     type: number
 *     description: Duration in days
 */
export type VendorCreateAdsPromotionType = z.infer<typeof VendorCreateAdsPromotion>
export const VendorCreateAdsPromotion = z.object({
  type: z.enum(['product', 'store']),
  target_id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  duration_days: z.number().min(1)
}).strict()