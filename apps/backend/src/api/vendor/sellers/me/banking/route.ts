import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

import { fetchSellerByAuthActorId } from '../../../../../shared/infra/http/utils/seller'
import { updateSellerBankingWorkflow } from '../../../../../workflows/seller/workflows/update-seller-banking'

export interface BankingDetailsInput {
  banking_info: {
    bank_name: string
    account_number: string
    account_name: string
    bank_code: string
  }
  percentage_charge?: number
}

/**
 * @oas [get] /vendor/sellers/me/banking
 * operationId: "VendorGetSellerBanking"
 * summary: "Get Seller Banking Details"
 * description: "Retrieves the banking and Paystack recipient information for the authenticated seller."
 * x-authenticated: true
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             banking_info:
 *               type: object
 *               nullable: true
 *             paystack_recipient_code:
 *               type: string
 *               nullable: true
 *               description: "Paystack recipient code for payouts. If null, payout account has not been set up."
 *             has_payout_account:
 *               type: boolean
 *               description: "Indicates whether the seller has set up a payout account"
 * tags:
 *   - Seller Banking
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 */
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { id } = await fetchSellerByAuthActorId(
    req.auth_context.actor_id,
    req.scope,
     ['id', 'name'] 
  )

  const {
    data: [seller]
  } = await query.graph(
    {
      entity: 'seller',
      fields: ['banking_info', 'paystack_recipient_code', 'name'],
      filters: { id }
    },
    { throwIfKeyNotFound: true }
  )

  // Check if payout account has been set up
  const has_payout_account = !!seller.paystack_recipient_code

  res.json({
    banking_info: seller.banking_info,
    paystack_recipient_code: seller.paystack_recipient_code,
    has_payout_account
  })
}

/**
 * @oas [post] /vendor/sellers/me/banking
 * operationId: "VendorUpdateSellerBanking"
 * summary: "Update Seller Banking Details"
 * description: "Updates banking information and automatically creates Paystack transfer recipient."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         required:
 *           - banking_info
 *         properties:
 *           banking_info:
 *             type: object
 *             required:
 *               - bank_name
 *               - account_number
 *               - account_name
 *               - bank_code
 *             properties:
 *               bank_name:
 *                 type: string
 *               account_number:
 *                 type: string
 *               account_name:
 *                 type: string
 *               bank_code:
 *                 type: string
 *           percentage_charge:
 *             type: number
 *             description: Platform commission percentage (default 2.5%)
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             banking_info:
 *               type: object
 *             paystack_recipient_code:
 *               type: string
 *               description: "Paystack recipient code for payouts"
 *             has_payout_account:
 *               type: boolean
 *               description: "Indicates whether the seller has set up a payout account"
 * tags:
 *   - Seller Banking
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<BankingDetailsInput>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const seller = await fetchSellerByAuthActorId(
    req.auth_context.actor_id,
    req.scope,
    ['id', 'name', 'email', 'phone'] // Add the required fields
  )

  await updateSellerBankingWorkflow(req.scope).run({
    input: {
      seller_id: seller.id,
      business_name: seller.name,
      email: seller.email ?? undefined,
      phone: seller.phone ?? undefined,
      banking_info: req.validatedBody.banking_info,
      percentage_charge: req.validatedBody.percentage_charge
    }
  })

  const {
    data: [updatedSeller]
  } = await query.graph(
    {
      entity: 'seller',
      fields: ['banking_info', 'paystack_recipient_code'],
      filters: { id: seller.id }
    },
    { throwIfKeyNotFound: true }
  )

  res.json({
    banking_info: updatedSeller.banking_info,
    paystack_recipient_code: updatedSeller.paystack_recipient_code,
    has_payout_account: !!updatedSeller.paystack_recipient_code
  })
}