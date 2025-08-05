import { z } from 'zod'
import { createFindParams } from '@medusajs/medusa/api/utils/validators'

export type AdminGetAdsPromotionsParamsType = z.infer<typeof AdminGetAdsPromotionsParams>
export const AdminGetAdsPromotionsParams = createFindParams({
  offset: 0,
  limit: 50
}).extend({
  status: z.enum(['draft', 'pending_payment', 'active', 'paused', 'expired', 'rejected']).optional(),
  type: z.enum(['product', 'store']).optional(),
  seller_id: z.string().optional()
})

/**
 * @schema AdminCreateAdsPricing
 * title: "Create Ads Pricing"
 * description: "Schema for creating ads pricing"
 * x-resourceId: AdminCreateAdsPricing
 * type: object
 * properties:
 *   type:
 *     type: string
 *     enum: [product, store]
 *     description: Type of ads
 *   duration_days:
 *     type: number
 *     description: Duration in days
 *   price_per_day:
 *     type: number
 *     description: Price per day in kobo
 *   currency_code:
 *     type: string
 *     description: Currency code
 */
export type AdminCreateAdsPricingType = z.infer<typeof AdminCreateAdsPricing>
export const AdminCreateAdsPricing = z.object({
  type: z.enum(['product', 'store']),
  duration_days: z.number().min(1),
  price_per_day: z.number().min(1),
  currency_code: z.string().default('NGN')
}).strict()

/**
 * @schema AdminUpdateAdsPricing
 * title: "Update Ads Pricing"
 * description: "Schema for updating ads pricing"
 * x-resourceId: AdminUpdateAdsPricing
 * type: object
 * properties:
 *   price_per_day:
 *     type: number
 *     description: Price per day in kobo
 *   is_active:
 *     type: boolean
 *     description: Whether pricing is active
 */
export type AdminUpdateAdsPricingType = z.infer<typeof AdminUpdateAdsPricing>
export const AdminUpdateAdsPricing = z.object({
  price_per_day: z.number().min(1).optional(),
  is_active: z.boolean().optional()
}).strict()

/**
 * @schema AdminReviewAdsPromotion
 * title: "Review Ads Promotion"
 * description: "Schema for admin review of ads promotion"
 * x-resourceId: AdminReviewAdsPromotion
 * type: object
 * properties:
 *   status:
 *     type: string
 *     enum: [active, rejected]
 *     description: Status after review
 *   admin_reviewer_note:
 *     type: string
 *     description: Admin reviewer note
 */
export type AdminReviewAdsPromotionType = z.infer<typeof AdminReviewAdsPromotion>
export const AdminReviewAdsPromotion = z.object({
  status: z.enum(['active', 'rejected']),
  admin_reviewer_note: z.string().optional()
}).strict()