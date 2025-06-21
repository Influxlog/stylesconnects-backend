import { MedusaRequest, MedusaResponse } from '@medusajs/framework'
import { Modules } from '@medusajs/framework/utils'

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const eventBus = req.scope.resolve(Modules.EVENT_BUS)

  await eventBus.emit(
    {
      name: 'paystack.webhook.received',
      data: {
        event: (req.body as any).event,
        data: (req.body as any).data,
        rawData: req.rawBody, // Add this
        headers: req.headers   // Add this
      }
    },
    {
      delay: 0,
      attempts: 3
    }
  )

  res.sendStatus(200)
}
