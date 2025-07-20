import { MedusaRequest, MedusaResponse } from '@medusajs/framework'

import { PaystackTransferService } from '../../../../modules/payment-paystack/services/paystack-transfer'

export const GET = async (
  req: MedusaRequest<{ page?: number; perPage?: number; status?: string }>,
  res: MedusaResponse
) => {
  const transferService = new PaystackTransferService()
  const { page, perPage, status } = req.query

  const transfers = await transferService.listTransfers({
    page: page ? parseInt(page as string) : 1,
    perPage: perPage ? parseInt(perPage as string) : 50,
    status: status as string
  })

  res.json(transfers)
}
