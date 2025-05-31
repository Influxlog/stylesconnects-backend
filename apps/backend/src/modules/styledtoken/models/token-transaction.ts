import { model } from '@medusajs/framework/utils'

export const TokenTransaction = model.define('token_transaction', {
  id: model.id({ prefix: 'sttxn' }).primaryKey(),
  customer_id: model.text(),
  type: model.enum(['earned', 'spent', 'expired', 'refunded']),
  activity_type: model.enum([
    'purchase_completed',
    'review_submitted',
    'referral_signup',
    'social_share',
    'birthday_bonus',
    'welcome_bonus',
    'product_redemption',
    'manual_adjustment'
  ]),
  amount: model.number(),
  reference_id: model.text().nullable(), // Order ID, Product ID, etc.
  reference_type: model.text().nullable(), // 'order', 'product', 'review', etc.
  description: model.text(),
  expires_at: model.dateTime().nullable(),
  metadata: model.json().nullable()
})