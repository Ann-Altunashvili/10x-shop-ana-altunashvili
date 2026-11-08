import type { Order, ShippingInfo } from '../../types/order'
import { isArrayOf, isRecord } from './common'
import { isCartItem } from './cart.guards'

function isShippingInfo(value: unknown): value is ShippingInfo {
  return (
    isRecord(value) &&
    typeof value.fullName === 'string' &&
    typeof value.email === 'string' &&
    typeof value.address === 'string' &&
    typeof value.city === 'string'
  )
}

export function isOrder(value: unknown): value is Order {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.number === 'string' &&
    isArrayOf(value.items, isCartItem) &&
    isShippingInfo(value.shipping) &&
    typeof value.subtotal === 'number' &&
    typeof value.discount === 'number' &&
    typeof value.shippingCost === 'number' &&
    typeof value.total === 'number' &&
    (value.promoCode === null || typeof value.promoCode === 'string') &&
    typeof value.placedAt === 'string'
  )
}

export function isOrderList(value: unknown): value is Order[] {
  return isArrayOf(value, isOrder)
}
