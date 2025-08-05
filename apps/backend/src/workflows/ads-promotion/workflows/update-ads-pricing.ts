import { WorkflowResponse, createWorkflow } from '@medusajs/framework/workflows-sdk'
import { UpdateAdsPricingDTO } from '../../../modules/ads-promotion/types/common'
import { updateAdsPricingStep } from '../steps'

export const updateAdsPricingWorkflow = createWorkflow(
  'update-ads-pricing',
  function (input: UpdateAdsPricingDTO) {
    const ads_pricing = updateAdsPricingStep(input)
    return new WorkflowResponse(ads_pricing)
  }
)