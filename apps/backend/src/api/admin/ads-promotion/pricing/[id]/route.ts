import { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { updateAdsPricingWorkflow } from '../../../../../workflows/ads-promotion/workflows'
import { AdminUpdateAdsPricingType } from '../../validators'

/**
 * @oas [post] /admin/ads-promotion/pricing/{id}
 * operationId: "AdminUpdateAdsPricing"
 * summary: "Update ads pricing"
 * description: "Updates ads pricing by id"
 * x-authenticated: true
 */
export async function POST(
  req: MedusaRequest<AdminUpdateAdsPricingType>,
  res: MedusaResponse
): Promise<void> {
  const { result: ads_pricing } = await updateAdsPricingWorkflow.run({
    input: { ...req.validatedBody, id: req.params.id },
    container: req.scope
  })

  res.json({ ads_pricing })
}