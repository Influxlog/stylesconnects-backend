import { MedusaService } from '@medusajs/framework/utils'

import { StyledToken, TokenConfig, TokenTransaction } from './models'

class StyledTokenModuleService extends MedusaService({
  StyledToken,
  TokenTransaction,
  TokenConfig
}) {
  async getCustomerTokenBalance(customerId: string) {
    const tokenAccount = await this.retrieveStyledToken(customerId, {
      select: ['balance', 'total_earned', 'total_spent', 'status']
    }).catch(() => null)

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
    let tokenAccount = await this.retrieveStyledToken(data.customer_id).catch(
      () => null
    )

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
    const tokenAccount = await this.retrieveStyledToken(data.customer_id)

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

  async getTokenConfigs() {
    return await this.listTokenConfigs(
      {},
      {
        order: { config_type: 'ASC' }
      }
    )
  }

  async updateTokenConfig(
    configType: string,
    data: {
      min_amount?: number
      max_amount?: number
      token_reward?: number
      token_value?: number
      is_enabled?: boolean
    }
  ) {
    const existingConfig = await this.retrieveTokenConfig(
      configType,
      { select: ['id'] }
    ).catch(() => null)

    if (existingConfig) {
      return await this.updateTokenConfigs({
        id: existingConfig.id,
        ...data,
        updated_at: new Date()
      })
    } else {
      return await this.createTokenConfigs({
        config_type: configType as "purchase_reward_tier_1" | "purchase_reward_tier_2" | "token_value",
        ...data
      })
    }
  }

  async calculatePurchaseReward(purchaseAmount: number) {
    const configs = await this.getTokenConfigs()

    // Find applicable tier
    for (const config of configs) {
      if (
        config.config_type.startsWith('purchase_reward_tier') &&
        config.is_enabled
      ) {
        const minAmount = Number(config.min_amount || 0)
        const maxAmount = config.max_amount
          ? Number(config.max_amount)
          : Infinity

        if (purchaseAmount >= minAmount && purchaseAmount <= maxAmount) {
          return config.token_reward
        }
      }
    }

    return 0 // No reward if no tier matches
  }

  async awardPurchaseTokens(data: {
    customer_id: string
    purchase_amount: number
    order_id: string
    metadata?: Record<string, any>
  }) {
    const tokenReward = await this.calculatePurchaseReward(data.purchase_amount)

    if (tokenReward <= 0) {
      return null // No tokens to award
    }

    return await this.awardTokens({
      customer_id: data.customer_id,
      amount: tokenReward,
      activity_type: 'purchase',
      reference_id: data.order_id,
      reference_type: 'order',
      description: `Purchase reward for order ${data.order_id} (${data.purchase_amount})`,
      metadata: {
        ...data.metadata,
        purchase_amount: data.purchase_amount,
        reward_tier: tokenReward === 20 ? 'tier_1' : 'tier_2'
      }
    })
  }
}

export default StyledTokenModuleService
