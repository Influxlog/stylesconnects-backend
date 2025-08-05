import { Modules } from '@medusajs/framework/utils'
import { StepResponse, createStep } from '@medusajs/framework/workflows-sdk'

import { ADS_PROMOTION_MODULE } from '../../../modules/ads-promotion'
import AdsPromotionModuleService from '../../../modules/ads-promotion/service'
import { SELLER_MODULE } from '../../../modules/seller'
import SellerModuleService from '../../../modules/seller/service'

export const initiateAdsPaymentStep = createStep(
  'initiate-ads-payment',
  async (
    input: { ads_promotion_id: string; seller_id: string },
    { container }
  ) => {
    const adsService =
      container.resolve<AdsPromotionModuleService>(ADS_PROMOTION_MODULE)
    const sellerService = container.resolve<SellerModuleService>(SELLER_MODULE)
    const paymentService = container.resolve(Modules.PAYMENT)

    const ads_promotion = await adsService.retrieveAdsPromotion(
      input.ads_promotion_id
    )
    const seller = await sellerService.retrieveSeller(input.seller_id, {
      relations: ['members']
    })

    // Use seller email or fallback to member email
    let email = seller.email
    if (!email && seller.members && seller.members.length > 0) {
      // Find the owner member or first member with email
      const ownerMember =
        seller.members.find((m) => m.role === 'owner') || seller.members[0]
      email = ownerMember?.email
    }

    if (!email) {
      throw new Error(
        'Seller email is required for payment. Please update your seller profile or ensure at least one member has a valid email address.'
      )
    }

    // Create payment collection
    const payment_collection = await paymentService.createPaymentCollections({
      currency_code: ads_promotion.currency_code,
      amount: ads_promotion.budget_amount,
      metadata: {
        ads_promotion_id: ads_promotion.id,
        seller_id: seller.id,
        type: 'ads_promotion'
      }
    })

    // Create payment session with Paystack
    const payment_session = await paymentService.createPaymentSession(
      payment_collection.id,
      {
        provider_id: 'pp_paystack_paystack',
        currency_code: ads_promotion.currency_code,
        amount: ads_promotion.budget_amount,
        data: {},
        context: {
          customer: {
            id: seller.id,
            email: email
          }
        }
      }
    )

    // Update ads promotion with payment reference
    const updated_ads = await adsService.updateAdsPromotions({
      id: ads_promotion.id,
      payment_reference: payment_session.id
    })

    return new StepResponse({
      ads_promotion: updated_ads,
      payment_session,
      payment_collection
    })
  }
)
