import { model } from '@medusajs/framework/utils'

export const AdsPricing = model.define('ads_pricing', {
  id: model.id({ prefix: 'ads_price' }).primaryKey(),
  type: model.enum(['product', 'store']),
  duration_days: model.number(),
  price_per_day: model.bigNumber(),
  currency_code: model.text().default('NGN'),
  is_active: model.boolean().default(true)
})