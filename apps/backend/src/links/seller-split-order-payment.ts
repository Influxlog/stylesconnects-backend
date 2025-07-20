import { defineLink } from '@medusajs/framework/utils'

import SellerModule from '../modules/seller'
import SplitOrderPaymentModule from '../modules/split-order-payment'

export default defineLink(
  SellerModule.linkable.seller,
  SplitOrderPaymentModule.linkable.splitOrderPayment
)