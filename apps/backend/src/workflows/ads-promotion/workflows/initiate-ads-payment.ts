import { WorkflowResponse, createWorkflow } from '@medusajs/framework/workflows-sdk'
import { initiateAdsPaymentStep } from '../steps'

export const initiateAdsPromotionPaymentWorkflow = createWorkflow(
  'initiate-ads-promotion-payment',
  function (input: { ads_promotion_id: string; seller_id: string }) {
    const result = initiateAdsPaymentStep(input)
    return new WorkflowResponse(result)
  }
)