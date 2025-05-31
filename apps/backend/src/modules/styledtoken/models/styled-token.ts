import { model } from '@medusajs/framework/utils'

export const StyledToken = model.define('styled_token', {
  id: model.id({ prefix: 'stoken' }).primaryKey(),
  customer_id: model.text(),
  balance: model.number().default(0),
  total_earned: model.number().default(0),
  total_spent: model.number().default(0),
  status: model.enum(['active', 'suspended', 'inactive']).default('active'),
  metadata: model.json().nullable()
})