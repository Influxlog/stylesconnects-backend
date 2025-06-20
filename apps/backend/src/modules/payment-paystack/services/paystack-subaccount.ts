 import axios, { AxiosInstance } from 'axios'
import { MedusaError } from '@medusajs/framework/utils'

export interface PaystackSubaccountData {
  business_name: string
  settlement_bank: string
  account_number: string
  percentage_charge: number
  description?: string
  primary_contact_email?: string
  primary_contact_name?: string
  primary_contact_phone?: string
  metadata?: Record<string, any>
}

export interface PaystackSubaccountResponse {
  status: boolean
  message: string
  data: {
    subaccount_code: string
    business_name: string
    settlement_bank: string
    account_number: string
    percentage_charge: number
    is_verified: boolean
    primary_contact_email: string
    primary_contact_name: string
    primary_contact_phone: string
    metadata: Record<string, any>
    product_description: string
    settlement_schedule: string
    active: boolean
    migrate: boolean
    id: number
    createdAt: string
    updatedAt: string
  }
}

export class PaystackSubaccountService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.paystack.co',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    })
  }

  async createSubaccount(data: PaystackSubaccountData): Promise<PaystackSubaccountResponse> {
    try {
      const response = await this.client.post('/subaccount', data)
      return response.data
    } catch (error: any) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Failed to create Paystack subaccount: ${error.response?.data?.message || error.message}`
      )
    }
  }

  async updateSubaccount(
    subaccountCode: string, 
    data: Partial<PaystackSubaccountData>
  ): Promise<PaystackSubaccountResponse> {
    try {
      const response = await this.client.put(`/subaccount/${subaccountCode}`, data)
      return response.data
    } catch (error: any) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Failed to update Paystack subaccount: ${error.response?.data?.message || error.message}`
      )
    }
  }

  async getSubaccount(subaccountCode: string): Promise<PaystackSubaccountResponse> {
    try {
      const response = await this.client.get(`/subaccount/${subaccountCode}`)
      return response.data
    } catch (error: any) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Failed to fetch Paystack subaccount: ${error.response?.data?.message || error.message}`
      )
    }
  }

  async listBanks(): Promise<any> {
    try {
      const response = await this.client.get('/bank')
      return response.data
    } catch (error: any) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Failed to fetch banks: ${error.response?.data?.message || error.message}`
      )
    }
  }

  async verifyAccountNumber(accountNumber: string, bankCode: string): Promise<any> {
    try {
      const response = await this.client.get(
        `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`
      )
      return response.data
    } catch (error: any) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Failed to verify account: ${error.response?.data?.message || error.message}`
      )
    }
  }
}