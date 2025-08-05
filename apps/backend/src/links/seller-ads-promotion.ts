import { defineLink } from '@medusajs/framework/utils'

import AdsPromotionModule from '../modules/ads-promotion'
import SellerModule from '../modules/seller'

export default defineLink(SellerModule.linkable.seller, {
  linkable: AdsPromotionModule.linkable.adsPromotion,
  isList: true
})