import { SubscriberArgs, SubscriberConfig } from '@medusajs/framework'
import { STYLEDTOKEN_MODULE } from '../modules/styledtoken'
import StyledTokenModuleService from '../modules/styledtoken/service'

export default async function orderCompletedHandler({
  event: { data },
  container
}: SubscriberArgs<{ id: string }>) {
  const styledTokenService: StyledTokenModuleService = container.resolve(STYLEDTOKEN_MODULE)
  const orderService = container.resolve('order')
  
  try {
    const order = await orderService.retrieveOrder(data.id, {
      relations: ['customer']
    })
    
    if (order.customer_id && order.total) {
      await styledTokenService.awardPurchaseTokens({
        customer_id: order.customer_id,
        purchase_amount: Number(order.total),
        order_id: order.id,
        metadata: {
          currency_code: order.currency_code
        }
      })
    }
  } catch (error) {
    console.error('Failed to award purchase tokens:', error)
  }
}

export const config: SubscriberConfig = {
  event: 'order.completed'
}