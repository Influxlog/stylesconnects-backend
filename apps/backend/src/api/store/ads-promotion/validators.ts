import { z } from 'zod'
import { createFindParams } from '@medusajs/medusa/api/utils/validators'

export type StoreGetAdsPromotionsParamsType = z.infer<typeof StoreGetAdsPromotionsParams>
export const StoreGetAdsPromotionsParams = createFindParams({
  offset: 0,
  limit: 50
}).extend({
  type: z.enum(['product', 'store']).optional()
})

/**
 * @schema StoreCreateAdsPromotion
 * title: "Create Ads Promotion"
 * description: "Schema for creating ads promotion"
 * x-resourceId: StoreCreateAdsPromotion
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
export type StoreCreateAdsPromotionType = z.infer<typeof StoreCreateAdsPromotion>
export const StoreCreateAdsPromotion = z.object({
  type: z.enum(['product', 'store']),
  target_id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  duration_days: z.number().min(1)
}).strict()