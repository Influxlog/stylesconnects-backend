import { createStep, StepResponse } from '@medusajs/framework/workflows-sdk'
import { STYLEDTOKEN_MODULE } from '../../../modules/styledtoken'
import StyledTokenModuleService from '../../../modules/styledtoken/service'
import { AwardTokensDTO } from '../../../modules/styledtoken/types'

export const awardTokensStep = createStep(
  'award-tokens',
  async (input: AwardTokensDTO, { container }) => {
    const styledTokenService = container.resolve<StyledTokenModuleService>(STYLEDTOKEN_MODULE)
    
    const result = await styledTokenService.awardTokens(input)
    
    return new StepResponse(result, {
      customer_id: input.customer_id,
      transaction_id: result.transaction.id
    })
  },
  async (compensateInput, { container }) => {
    // Compensation logic if needed
    const styledTokenService = container.resolve<StyledTokenModuleService>(STYLEDTOKEN_MODULE)
    
      // Could implement reversal logic here
    
  }
)