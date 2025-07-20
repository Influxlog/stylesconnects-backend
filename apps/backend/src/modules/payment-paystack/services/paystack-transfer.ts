import axios, { AxiosInstance } from 'axios'

import { MedusaError } from '@medusajs/framework/utils'

export interface PaystackTransferRecipient {
  type: 'nuban' | 'mobile_money' | 'basa'
  name: string
  account_number: string
  bank_code: string
  currency: string
  description?: string
  metadata?: Record<string, any>
}

export interface PaystackTransferData {
  source: 'balance'
  amount: number
  recipient: string
  reason: string
  currency?: string
  reference?: string
}

export interface PaystackBulkTransferData {
  currency: string
  source: 'balance'
  transfers: Array<{
    amount: number
    recipient: string
    reference?: string
    reason?: string
  }>
}

export class PaystackTransferService {
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

  async createTransferRecipient(data: PaystackTransferRecipient) {
    try {
      const response = await this.client.post('/transferrecipient', data)
      return response.data
    } catch (error: any) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Failed to create transfer recipient: ${error.response?.data?.message || error.message}`
      )
    }
  }

  async initiateTransfer(data: PaystackTransferData) {
    try {
      const response = await this.client.post('/transfer', data)
      return response.data
    } catch (error: any) {
      throw new MedusaError(
        MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
        `Failed to initiate transfer: ${error.response?.data?.message || error.message}`
      )
    }
  }

  async initiateBulkTransfer(data: PaystackBulkTransferData) {
    try {
      const response = await this.client.post('/transfer/bulk', data)
      return response.data
    } catch (error: any) {
      throw new MedusaError(
        MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
        `Failed to initiate bulk transfer: ${error.response?.data?.message || error.message}`
      )
    }
  }

  async verifyTransfer(transferCode: string) {
    try {
      const response = await this.client.get(`/transfer/verify/${transferCode}`)
      return response.data
    } catch (error: any) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Failed to verify transfer: ${error.response?.data?.message || error.message}`
      )
    }
  }

  async listTransfers(params?: {
    perPage?: number
    page?: number
    status?: string
  }) {
    try {
      const response = await this.client.get('/transfer', { params })
      return response.data
    } catch (error: any) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Failed to list transfers: ${error.response?.data?.message || error.message}`
      )
    }
  }
}
