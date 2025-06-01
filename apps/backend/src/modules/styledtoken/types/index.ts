export interface AwardTokensDTO {
  customer_id: string
  amount: number
  activity_type: string
  reference_id?: string
  reference_type?: string
  description: string
  expires_at?: Date
  metadata?: Record<string, any>
}

export interface SpendTokensDTO {
  customer_id: string
  amount: number
  activity_type: string
  reference_id?: string
  reference_type?: string
  description: string
  metadata?: Record<string, any>
}

export interface TokenBalance {
  balance: number
  total_earned: number
  total_spent: number
  status: string
}

export interface TokenConfigDTO {
  config_type: 'purchase_reward_tier_1' | 'purchase_reward_tier_2' | 'token_value'
  min_amount?: number
  max_amount?: number
  token_reward?: number
  token_value?: number
  is_enabled?: boolean
}

export interface PurchaseRewardDTO {
  customer_id: string
  purchase_amount: number
  order_id: string
  metadata?: Record<string, any>
}