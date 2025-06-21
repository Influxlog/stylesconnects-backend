import { MiddlewareRoute } from '@medusajs/framework'

export const hooksMiddlewares: MiddlewareRoute[] = [
  {
    method: ['POST'],
    matcher: '/hooks/payouts',
    bodyParser: { preserveRawBody: true }
  },
  {
    method: ['POST'],
    matcher: '/hooks/paystack', // Add this middleware
    bodyParser: { preserveRawBody: true }
  }
]
