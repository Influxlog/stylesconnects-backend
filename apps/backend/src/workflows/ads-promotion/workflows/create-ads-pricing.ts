import { WorkflowResponse, createWorkflow } from '@medusajs/framework/workflows-sdk'
import { CreateAdsPricingDTO } from '../../../modules/ads-promotion/types/common'
import { createAdsPricingStep } from '../steps'

export const createAdsPricingWorkflow = createWorkflow(
  'create-ads-pricing',
  function (input: CreateAdsPricingDTO) {
    const ads_pricing = createAdsPricingStep(input)
    return new WorkflowResponse(ads_pricing)
  }
)