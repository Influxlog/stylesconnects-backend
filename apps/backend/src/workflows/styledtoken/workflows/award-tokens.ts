import { createWorkflow, WorkflowResponse } from '@medusajs/framework/workflows-sdk'
import { awardTokensStep } from '../steps/award-tokens'
import { AwardTokensDTO } from '../../../modules/styledtoken/types'

export const awardTokensWorkflow = createWorkflow(
  'award-tokens',
  (input: AwardTokensDTO) => {
    const result = awardTokensStep(input)
    
    return new WorkflowResponse(result)
  }
)