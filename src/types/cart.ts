import type { Product } from './product'

/** The part of a Product that the cart needs - Product is assignable to it. */
export type CartProduct = Pick<
  Product,
  'id' | 'title' | 'thumbnail' | 'price' | 'discountPercentage' | 'stock'
>

export interface CartItem {
  productId: number
  title: string
  thumbnail: string
  price: number
  discountPercentage: number
  stock: number
  quantity: number
}

export interface CartState {
  items: CartItem[]
  promoCode?: string | null
}

export type AddItemResult = { ok: true } | { ok: false; message: string }
