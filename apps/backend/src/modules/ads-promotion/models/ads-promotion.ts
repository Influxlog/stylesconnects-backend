import { model } from '@medusajs/framework/utils'

export const AdsPromotion = model.define('ads_promotion', {
  id: model.id({ prefix: 'ads' }).primaryKey(),
  seller_id: model.text(),
  type: model.enum(['product', 'store']).default('product'),
  target_id: model.text().nullable(), // product_id for product ads, null for store ads
  title: model.text(),
  description: model.text().nullable(),
  image_url: model.text().nullable(),
  status: model.enum(['draft', 'pending_payment', 'active', 'paused', 'expired', 'rejected']).default('draft'),
  start_date: model.dateTime().nullable(),
  end_date: model.dateTime().nullable(),
  budget_amount: model.bigNumber(),
  spent_amount: model.bigNumber().default(0),
  currency_code: model.text().default('NGN'),
  payment_reference: model.text().nullable(),
  payment_status: model.enum(['pending', 'paid', 'failed', 'refunded']).default('pending'),
  admin_reviewer_id: model.text().nullable(),
  admin_reviewer_note: model.text().nullable(),
  admin_review_date: model.dateTime().nullable(),
  clicks: model.number().default(0),
  impressions: model.number().default(0)
})