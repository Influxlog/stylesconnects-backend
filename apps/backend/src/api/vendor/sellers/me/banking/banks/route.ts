import { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework'

import { PaystackSubaccountService } from '../../../../../../modules/payment-paystack/services/paystack-subaccount'

/**
 * @oas [get] /vendor/sellers/me/banking/banks
 * operationId: "VendorGetBanksList"
 * summary: "Get Available Banks"
 * description: "Retrieves list of available banks from Paystack for account setup."
 * x-authenticated: true
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             banks:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   code:
 *                     type: string
 *                   active:
 *                     type: boolean
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
  const paystackService = new PaystackSubaccountService()
  const banksResponse = await paystackService.listBanks()

  res.json({
    banks: banksResponse.data
  })
}