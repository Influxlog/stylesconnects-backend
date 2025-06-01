export const defaultStoreStyledTokenFields = [
  'id',
  'customer_id', 
  'balance',
  'total_earned',
  'total_spent',
  'status',
  'created_at',
  'updated_at'
]

export const retrieveStoreStyledTokenConfig = {
  defaults: defaultStoreStyledTokenFields,
  isList: false
}

export const listStoreStyledTokenConfig = {
  defaults: defaultStoreStyledTokenFields,
  isList: true
}