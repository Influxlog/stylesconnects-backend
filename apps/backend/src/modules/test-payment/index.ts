import { ModuleProvider, Modules } from '@medusajs/framework/utils'

import MyPaymentProviderService from './service'

export default ModuleProvider(Modules.PAYMENT, {
  services: [MyPaymentProviderService]
})
