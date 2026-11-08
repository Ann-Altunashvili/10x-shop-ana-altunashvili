import { Cart } from '../models/Cart'
import type { AddItemResult, CartItem, CartProduct, CartState } from '../types/cart'

export type CartAction =
  | { type: 'ADD_ITEM'; product: CartProduct; qty: number }
  | { type: 'SET_QTY'; productId: number; qty: number }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'CLEAR' }
  | { type: 'APPLY_PROMO'; code: string }
  | { type: 'REMOVE_PROMO' }

export const EMPTY_CART: CartState = { items: [], promoCode: null }

/** Can `qty` more pieces of `product` be added? The same rule is used by the UI and the reducer. */
export function checkAddItem(
  items: readonly CartItem[],
  product: CartProduct,
  qty: number,
): AddItemResult {
  if (!Number.isInteger(qty) || qty < 1) return { ok: false, message: 'Choose at least 1 item.' }
  if (product.stock === 0) return { ok: false, message: 'This product is out of stock.' }

  const inCart = items.find((item) => item.productId === product.id)?.quantity ?? 0
  const remaining = product.stock - inCart
  if (remaining <= 0) {
    return { ok: false, message: `You already have all ${product.stock} available in your cart.` }
  }
  if (qty > remaining) {
    return { ok: false, message: `Only ${remaining} more can be added (${product.stock} in stock).` }
  }
  return { ok: true }
}

/** A pure function: (state, action) -> new state. It never mutates and never touches localStorage. */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      if (!checkAddItem(state.items, action.product, action.qty).ok) return state

      const exists = state.items.some((item) => item.productId === action.product.id)
      const items: CartItem[] = exists
        ? state.items.map((item) =>
            item.productId === action.product.id
              ? { ...item, quantity: item.quantity + action.qty }
              : item,
          )
        : [
            ...state.items,
            {
              productId: action.product.id,
              title: action.product.title,
              thumbnail: action.product.thumbnail,
              price: action.product.price,
              discountPercentage: action.product.discountPercentage,
              stock: action.product.stock,
              quantity: action.qty,
            },
          ]
      return { ...state, items }
    }

    case 'SET_QTY': {
      const item = state.items.find((candidate) => candidate.productId === action.productId)
      if (!item || !Number.isInteger(action.qty) || action.qty < 1 || action.qty > item.stock) {
        return state
      }
      return {
        ...state,
        items: state.items.map((candidate) =>
          candidate.productId === action.productId
            ? { ...candidate, quantity: action.qty }
            : candidate,
        ),
      }
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.productId !== action.productId) }

    case 'CLEAR':
      return EMPTY_CART

    case 'APPLY_PROMO':
      return Cart.isValidPromo(action.code) ? { ...state, promoCode: Cart.PROMO_CODE } : state

    case 'REMOVE_PROMO':
      return { ...state, promoCode: null }

    default: {
      // If a new action type is added and not handled above, TypeScript fails right here.
      const exhaustive: never = action
      return exhaustive
    }
  }
}
