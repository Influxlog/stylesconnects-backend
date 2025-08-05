import { WorkflowResponse, createWorkflow } from '@medusajs/framework/workflows-sdk'
import { CreateAdsPromotionDTO } from '../../../modules/ads-promotion/types/common'
import { createAdsPromotionStep } from '../steps'

export const createAdsPromotionWorkflow = createWorkflow(
  'create-ads-promotion',
  function (input: CreateAdsPromotionDTO) {
    const ads_promotion = createAdsPromotionStep(input)
    return new WorkflowResponse(ads_promotion)
  }
)