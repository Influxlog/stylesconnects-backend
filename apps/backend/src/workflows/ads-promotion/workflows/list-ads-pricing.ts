import { WorkflowResponse, createWorkflow } from '@medusajs/framework/workflows-sdk'
import { listAdsPricingStep } from '../steps'

export const listAdsPricingWorkflow = createWorkflow(
  'list-ads-pricing',
  function (input: { filters?: any; pagination?: any }) {
    const ads_pricing = listAdsPricingStep(input)
    return new WorkflowResponse(ads_pricing)
  }
)