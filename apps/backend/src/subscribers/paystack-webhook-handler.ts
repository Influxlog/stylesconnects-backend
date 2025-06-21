import { SubscriberArgs, SubscriberConfig } from '@medusajs/framework'

import { markSplitOrderPaymentsAsCapturedWorkflow } from '../workflows/split-order-payment/workflows'

export default async function paystackWebhookHandler({
  event,
  container
}: SubscriberArgs<{ event: string; data: any }>) {
  // Add console.log to debug the entire event
  console.log('Paystack webhook received:', JSON.stringify(event.data, null, 2))
  
  const { event: eventType, data } = event.data
  
  // Also log the specific event type and data
  console.log('Event type:', eventType)
  console.log('Event data:', JSON.stringify(data, null, 2))

  switch (eventType) {
    case 'charge.success': { // Handle successful payment
      const paymentCollectionId = data.metadata?.payment_collection_id

      if (paymentCollectionId) {
        await markSplitOrderPaymentsAsCapturedWorkflow.run({
          container,
          input: paymentCollectionId
        })
      }
      break
    }

    case 'charge.failed':
      // Handle failed payment
      console.log('Payment failed:', data.reference)
      break

    default:
      console.log('Unhandled Paystack event:', eventType)
  }
}

export const config: SubscriberConfig = {
  event: 'paystack.webhook.received',
  context: {
    subscriberId: 'paystack-webhook-handler'
  }
}
