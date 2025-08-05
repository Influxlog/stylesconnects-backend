import { StepResponse, createStep } from '@medusajs/framework/workflows-sdk'
import { ADS_PROMOTION_MODULE } from '../../../modules/ads-promotion'
import AdsPromotionModuleService from '../../../modules/ads-promotion/service'

export const processAdsPaymentWebhookStep = createStep(
  'process-ads-payment-webhook',
  async (input: { payment_reference: string; status: 'success' | 'failed' }, { container }) => {
    const adsService = container.resolve<AdsPromotionModuleService>(ADS_PROMOTION_MODULE)

    const [ads_promotion] = await adsService.listAdsPromotions({
      payment_reference: input.payment_reference
    })

    if (!ads_promotion) {
      return new StepResponse(null)
    }

    let update_data: any = {
      id: ads_promotion.id,
      payment_status: input.status === 'success' ? 'paid' : 'failed'
    }

    if (input.status === 'success') {
      // Set start and end dates when payment is successful
      const start_date = new Date()
      const end_date = new Date()
      end_date.setDate(start_date.getDate() + (ads_promotion.budget_amount / 1000)) // Assuming price per day is in kobo
      
      update_data = {
        ...update_data,
        status: 'active',
        start_date,
        end_date
      }
    }

    const updated_ads = await adsService.updateAdsPromotions(update_data)
    return new StepResponse(updated_ads)
  }
)