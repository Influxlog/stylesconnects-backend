import { MiddlewareRoute, authenticate } from '@medusajs/framework'

export const storeStyledTokenMiddlewares: MiddlewareRoute[] = [
  {
    method: ['GET'],
    matcher: '/store/styledtoken',
    middlewares: [authenticate('customer', ['session', 'bearer'])]
  }
]