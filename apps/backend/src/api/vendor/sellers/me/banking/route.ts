import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'

import { fetchSellerByAuthActorId } from '../../../../../shared/infra/http/utils/seller'
import { updateSellerBankingWorkflow } from '../../../../../workflows/seller/workflows/update-seller-banking'
import { PaystackSubaccountService } from '../../../../../modules/payment-paystack/services/paystack-subaccount'

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
 * description: "Retrieves the banking and Paystack information for the authenticated seller."
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
 *             paystack_subaccount_code:
 *               type: string
 *               nullable: true
 *             paystack_subaccount_id:
 *               type: string
 *               nullable: true
 *             subaccount_status:
 *               type: string
 *               nullable: true
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
      fields: ['banking_info', 'paystack_subaccount_code', 'paystack_subaccount_id', 'name'],
      filters: { id }
    },
    { throwIfKeyNotFound: true }
  )

  let subaccountStatus:any = null
  if (seller.paystack_subaccount_code) {
    try {
      const paystackService = new PaystackSubaccountService()
      const subaccountData = await paystackService.getSubaccount(seller.paystack_subaccount_code)
      subaccountStatus = {
        active: subaccountData.data.active,
        is_verified: subaccountData.data.is_verified,
        settlement_schedule: subaccountData.data.settlement_schedule
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Subaccount might not exist or API error
      subaccountStatus = { error: 'Unable to fetch subaccount status' }
    }
  }

  res.json({
    banking_info: seller.banking_info,
    paystack_subaccount_code: seller.paystack_subaccount_code,
    paystack_subaccount_id: seller.paystack_subaccount_id,
    subaccount_status: subaccountStatus
  })
}

/**
 * @oas [post] /vendor/sellers/me/banking
 * operationId: "VendorUpdateSellerBanking"
 * summary: "Update Seller Banking Details"
 * description: "Updates banking information and automatically creates Paystack subaccount."
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
 *             paystack_subaccount_code:
 *               type: string
 *             paystack_subaccount_id:
 *               type: string
 *             subaccount_status:
 *               type: object
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

  const { result } = await updateSellerBankingWorkflow(req.scope).run({
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
      fields: ['banking_info', 'paystack_subaccount_code', 'paystack_subaccount_id'],
      filters: { id: seller.id }
    },
    { throwIfKeyNotFound: true }
  )

  res.json({
    banking_info: updatedSeller.banking_info,
    paystack_subaccount_code: updatedSeller.paystack_subaccount_code,
    paystack_subaccount_id: updatedSeller.paystack_subaccount_id,
    subaccount_status: {
      active: result.transfer_recipient ? true : false,
      is_verified: result.transfer_recipient ? true : false
    }
  })
}