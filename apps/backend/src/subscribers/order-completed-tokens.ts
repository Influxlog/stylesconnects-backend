import { SubscriberArgs, SubscriberConfig } from '@medusajs/medusa'
import { Modules } from '@medusajs/framework/utils'
import { awardTokensWorkflow } from '../workflows/styledtoken/workflows/award-tokens'

export default async function orderCompletedTokenHandler({
  event,
  container
}: SubscriberArgs<{ id: string }>) {
  const orderModuleService = container.resolve(Modules.ORDER)
  
  const order = await orderModuleService.retrieveOrder(event.data.id, {
    relations: ['items']
  })
  
  if (order.customer_id) {
    // Award 1 token per $10 spent (customize as needed)
    const tokensToAward = Math.floor(Number(order.total) / 1000) // Assuming total is in cents
    
    if (tokensToAward > 0) {
      await awardTokensWorkflow.run({
        container,
        input: {
          customer_id: order.customer_id,
          amount: tokensToAward,
          activity_type: 'purchase_completed',
          reference_id: order.id,
          reference_type: 'order',
          description: `Earned ${tokensToAward} tokens from order #${order.display_id}`
        }
      })
    }
  }
}

export const config: SubscriberConfig = {
  event: 'order.completed',
  context: {
    subscriberId: 'order-completed-token-handler'
  }
}