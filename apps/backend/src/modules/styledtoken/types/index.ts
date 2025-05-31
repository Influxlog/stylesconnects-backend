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