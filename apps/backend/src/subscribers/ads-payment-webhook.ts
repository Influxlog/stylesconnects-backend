import { SubscriberArgs, SubscriberConfig } from '@medusajs/framework'
import { PaymentEvents } from '@medusajs/framework/utils'
import { processAdsPaymentWebhookWorkflow } from '../workflows/ads-promotion/workflows'

export default async function adsPaymentWebhookHandler({
  event,
  container
}: SubscriberArgs<{ id: string; metadata?: any }>) {
  const payment_id = event.data.id
  const metadata = event.data.metadata

  // Check if this is an ads promotion payment
  if (metadata?.type === 'ads_promotion') {
    await processAdsPaymentWebhookWorkflow.run({
      container,
      input: {
        payment_reference: payment_id,
        status: 'success'
      }
    })
  }
}

export const config: SubscriberConfig = {
  event: PaymentEvents.CAPTURED,
  context: {
    subscriberId: 'ads-payment-webhook-handler'
  }
}