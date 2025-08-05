import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery
} from '@tanstack/react-query'
import { mercurQuery } from '../../lib/client'
import { queryKeysFactory } from '../../lib/query-keys-factory'

export const adsPromotionQueryKeys = queryKeysFactory('ads_promotion')

export const useAdsPromotions = (
  query?: any,
  options?: Omit<UseQueryOptions<any, Error, any, QueryKey>, 'queryFn' | 'queryKey'>
) => {
  const { data, ...other } = useQuery({
    queryKey: adsPromotionQueryKeys.list(query),
    queryFn: () => mercurQuery('/admin/ads-promotion', { method: 'GET', query }),
    ...options
  })
  return { ...data, ...other }
}

export const useReviewAdsPromotion = (
  options: UseMutationOptions<any, Error, { id: string; payload: any }>
) => {
  return useMutation({
    mutationFn: ({ id, payload }) =>
      mercurQuery(`/admin/ads-promotion/${id}`, {
        method: 'POST',
        body: payload
      }),
    ...options
  })
}

export const useCreateAdsPricing = (
  options: UseMutationOptions<any, Error, any>
) => {
  return useMutation({
    mutationFn: (payload) =>
      mercurQuery('/admin/ads-promotion/pricing', {
        method: 'POST',
        body: payload
      }),
    ...options
  })
}