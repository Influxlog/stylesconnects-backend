import { WorkflowResponse, createWorkflow } from '@medusajs/framework/workflows-sdk'
import { processAdsPaymentWebhookStep } from '../steps'

export const processAdsPaymentWebhookWorkflow = createWorkflow(
  'process-ads-payment-webhook',
  function (input: { payment_reference: string; status: 'success' | 'failed' }) {
    const result = processAdsPaymentWebhookStep(input)
    return new WorkflowResponse(result)
  }
)