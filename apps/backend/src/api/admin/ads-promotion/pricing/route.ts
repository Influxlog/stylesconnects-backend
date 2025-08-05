import { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'
import { createAdsPricingWorkflow } from '../../../../workflows/ads-promotion/workflows'
import { AdminCreateAdsPricingType } from '../validators'

/**
 * @oas [get] /admin/ads-promotion/pricing
 * operationId: "AdminListAdsPricing"
 * summary: "List ads pricing"
 * description: "Retrieves ads pricing list"
 * x-authenticated: true
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: ads_pricing } = await query.graph({
    entity: 'ads_pricing',
    fields: ['*'],
    filters: { is_active: true }
  })

  res.json({ ads_pricing })
}

/**
 * @oas [post] /admin/ads-promotion/pricing
 * operationId: "AdminCreateAdsPricing"
 * summary: "Create ads pricing"
 * description: "Creates new ads pricing"
 * x-authenticated: true
 */
export async function POST(
  req: MedusaRequest<AdminCreateAdsPricingType>,
  res: MedusaResponse
): Promise<void> {
  const { result: ads_pricing } = await createAdsPricingWorkflow.run({
    input: req.validatedBody,
    container: req.scope
  })

  res.status(201).json({ ads_pricing })
}