export enum AdsPromotionType {
  PRODUCT = 'product',
  STORE = 'store'
}

export enum AdsPromotionStatus {
  DRAFT = 'draft',
  PENDING_PAYMENT = 'pending_payment',
  ACTIVE = 'active',
  PAUSED = 'paused',
  EXPIRED = 'expired',
  REJECTED = 'rejected'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export type AdsPromotionDTO = {
  id: string
  seller_id: string
  type: AdsPromotionType
  target_id?: string
  title: string
  description?: string
  image_url?: string
  status: AdsPromotionStatus
  start_date?: Date
  end_date?: Date
  budget_amount: number
  spent_amount: number
  currency_code: string
  payment_reference?: string
  payment_status: PaymentStatus
  admin_reviewer_id?: string
  admin_reviewer_note?: string
  admin_review_date?: Date
  clicks: number
  impressions: number
  created_at: Date
  updated_at: Date
}

export type AdsPricingDTO = {
  id: string
  type: AdsPromotionType
  duration_days: number
  price_per_day: number
  currency_code: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export type CreateAdsPromotionDTO = {
  seller_id: string
  type: AdsPromotionType
  target_id?: string
  title: string
  description?: string
  image_url?: string
  duration_days: number
}

export type UpdateAdsPromotionDTO = {
  id: string
  title?: string
  description?: string
  image_url?: string
  status?: AdsPromotionStatus
  admin_reviewer_id?: string
  admin_reviewer_note?: string
  admin_review_date?: Date
}

export type CreateAdsPricingDTO = {
  type: AdsPromotionType
  duration_days: number
  price_per_day: number
  currency_code?: string
}

export type UpdateAdsPricingDTO = {
  id: string
  price_per_day?: number
  is_active?: boolean
}