import { z } from 'zod'
import { createSelectParams } from '@medusajs/medusa/api/utils/validators'

export const StoreGetStyledTokenParams = createSelectParams().merge(
  z.object({
    offset: z.coerce.number().optional().default(0),
    limit: z.coerce.number().optional().default(20)
  })
)

export type StoreGetStyledTokenParamsType = z.infer<typeof StoreGetStyledTokenParams>