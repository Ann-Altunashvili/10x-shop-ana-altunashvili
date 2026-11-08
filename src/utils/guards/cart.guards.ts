import type { CartItem, CartState } from '../../types/cart'
import { isArrayOf, isRecord } from './common'

export function isCartItem(value: unknown): value is CartItem {
  return (
    isRecord(value) &&
    typeof value.productId === 'number' &&
    typeof value.title === 'string' &&
    typeof value.thumbnail === 'string' &&
    typeof value.price === 'number' &&
    typeof value.discountPercentage === 'number' &&
    typeof value.stock === 'number' &&
    typeof value.quantity === 'number'
  )
}

export function isCartState(value: unknown): value is CartState {
  return (
    isRecord(value) &&
    isArrayOf(value.items, isCartItem) &&
    (value.promoCode === undefined || value.promoCode === null || typeof value.promoCode === 'string')
  )
}
