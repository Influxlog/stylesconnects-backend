import { ModuleProvider, Modules } from '@medusajs/framework/utils'

import PaystackCardProviderService from './services/paystack-card-provider'

export default ModuleProvider(Modules.PAYMENT, {
  services: [PaystackCardProviderService]
})
