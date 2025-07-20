import { model } from '@medusajs/framework/utils'

import { StoreStatus } from '../types'
import { MemberInvite } from './invite'
import { Member } from './member'
import { SellerOnboarding } from './onboarding'

export const Seller = model.define('seller', {
  id: model.id({ prefix: 'sel' }).primaryKey(),
  store_status: model.enum(StoreStatus).default(StoreStatus.ACTIVE),
  name: model.text().searchable(),
  handle: model.text().unique(),
  description: model.text().searchable().nullable(),
  photo: model.text().nullable(),
  email: model.text().nullable(),
  phone: model.text().nullable(),
  address_line: model.text().nullable(),
  city: model.text().nullable(),
  state: model.text().nullable(),
  postal_code: model.text().nullable(),
  country_code: model.text().nullable(),
  tax_id: model.text().nullable(),
  // Add Paystack subaccount information
  paystack_subaccount_code: model.text().nullable(),
  paystack_subaccount_id: model.text().nullable(),
  banking_info: model.json().nullable(), // Store bank details
  members: model.hasMany(() => Member),
  invites: model.hasMany(() => MemberInvite),
  onboarding: model.hasOne(() => SellerOnboarding).nullable()
})
