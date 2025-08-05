import { WorkflowResponse, createWorkflow } from '@medusajs/framework/workflows-sdk'
import { listAdsPromotionsStep } from '../steps'

export const listAdsPromotionsWorkflow = createWorkflow(
  'list-ads-promotions',
  function (input: { filters?: any; pagination?: any }) {
    const ads_promotions = listAdsPromotionsStep(input)
    return new WorkflowResponse(ads_promotions)
  }
)