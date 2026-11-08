import type { CartItem } from './cart'

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered'

export interface ShippingInfo {
  fullName: string
  email: string
  address: string
  city: string
}

/** A locally simulated order. There is no payment data at all. */
export interface Order {
  id: number // Date.now() at the moment the order is placed
  number: string // "10X-00001"
  items: CartItem[]
  shipping: ShippingInfo
  subtotal: number
  discount: number
  shippingCost: number
  total: number
  promoCode: string | null
  placedAt: string // new Date().toISOString()
}
