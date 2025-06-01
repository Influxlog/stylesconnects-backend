import { model } from '@medusajs/framework/utils';


export const TokenConfig = model.define('token_config', {
  id: model.id({ prefix: 'tkconf' }).primaryKey(),
  config_type: model
    .enum([
      'purchase_reward_tier_1', // 20,000 - 100,000
      'purchase_reward_tier_2', // 101,000 and above
      'token_value' // 1 token = X amount
    ])
    .unique(),
  min_amount: model.number().nullable(), // minimum purchase amount for tier
  max_amount: model.number().nullable(), // maximum purchase amount for tier
  token_reward: model.number(), // tokens to award
  token_value: model.number().nullable(), // value of 1 token in currency
  is_enabled: model.boolean().default(true)
})