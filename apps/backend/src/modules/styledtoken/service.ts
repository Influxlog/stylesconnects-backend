import { MedusaService } from '@medusajs/framework/utils'
import { StyledToken, TokenTransaction } from './models'

class StyledTokenModuleService extends MedusaService({
  StyledToken,
  TokenTransaction
}) {
  async getCustomerTokenBalance(customerId: string) {
    const tokenAccount = await this.retrieveStyledToken(
      customerId,
      { select: ['balance', 'total_earned', 'total_spent', 'status'] }
    ).catch(() => null)

    if (!tokenAccount) {
      return { balance: 0, total_earned: 0, total_spent: 0, status: 'inactive' }
    }

    return tokenAccount
  }

  async awardTokens(data: {
    customer_id: string
    amount: number
    activity_type: string
    reference_id?: string
    reference_type?: string
    description: string
    expires_at?: Date
    metadata?: Record<string, any>
  }) {
    // Get or create token account
    let tokenAccount = await this.retrieveStyledToken(
      data.customer_id
    ).catch(() => null)

    if (!tokenAccount) {
      tokenAccount = await this.createStyledTokens({
        customer_id: data.customer_id,
        balance: 0,
        total_earned: 0,
        total_spent: 0,
        status: 'active'
      })
    }

    // Create transaction record
    const transaction = await this.createTokenTransactions({
      customer_id: data.customer_id,
      type: 'earned',
      activity_type: data.activity_type,
      amount: data.amount,
      reference_id: data.reference_id,
      reference_type: data.reference_type,
      description: data.description,
      expires_at: data.expires_at,
      metadata: data.metadata
    })

    // Update token account balance
    const updatedAccount = await this.updateStyledTokens({
      id: tokenAccount.id,
      balance: tokenAccount.balance + data.amount,
      total_earned: tokenAccount.total_earned + data.amount
    })

    return { account: updatedAccount, transaction }
  }

  async spendTokens(data: {
    customer_id: string
    amount: number
    activity_type: string
    reference_id?: string
    reference_type?: string
    description: string
    metadata?: Record<string, any>
  }) {
    const tokenAccount = await this.retrieveStyledToken(
     data.customer_id 
    )

    if (!tokenAccount || tokenAccount.balance < data.amount) {
      throw new Error('Insufficient token balance')
    }

    // Create transaction record
    const transaction = await this.createTokenTransactions({
      customer_id: data.customer_id,
      type: 'spent',
      activity_type: data.activity_type,
      amount: data.amount,
      reference_id: data.reference_id,
      reference_type: data.reference_type,
      description: data.description,
      metadata: data.metadata
    })

    // Update token account balance
    const updatedAccount = await this.updateStyledTokens({
      id: tokenAccount.id,
      balance: tokenAccount.balance - data.amount,
      total_spent: tokenAccount.total_spent + data.amount
    })

    return { account: updatedAccount, transaction }
  }

  async getCustomerTransactions(customerId: string, options: any = {}) {
    return await this.listTokenTransactions(
      { customer_id: customerId },
      {
        ...options,
        order: { created_at: 'DESC' }
      }
    )
  }
}

export default StyledTokenModuleService