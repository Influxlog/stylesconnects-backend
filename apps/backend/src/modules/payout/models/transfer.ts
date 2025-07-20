import { model } from '@medusajs/framework/utils'

export const Transfer = model.define('transfer', {
  id: model.id({ prefix: 'trans' }).primaryKey(),
  transfer_code: model.text(),
  recipient_code: model.text(),
  amount: model.bigNumber(),
  currency_code: model.text(),
  status: model.text(),
  reference: model.text(),
  reason: model.text().nullable(),
  paystack_data: model.json().nullable(),
  seller_id: model.text()
})
