import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import { Cart } from '../models/Cart'
import { cartStorage } from '../models/storage'
import type { AddItemResult, CartItem, CartProduct, CartState } from '../types/cart'
import { cartReducer, checkAddItem, EMPTY_CART } from './cart.reducer'

interface CartContextValue {
  items: CartItem[]
  promoCode: string | null
  cart: Cart
  itemCount: number
  addItem: (product: CartProduct, qty?: number) => AddItemResult
  setQuantity: (productId: number, qty: number) => void
  removeItem: (productId: number) => void
  clearCart: () => void
  applyPromo: (code: string) => boolean
  removePromo: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function loadInitialCart(): CartState {
  return cartStorage.get() ?? EMPTY_CART
}

export function CartProvider({ children }: { children: ReactNode }) {
  // The third argument runs once, so localStorage is read only on the first render.
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialCart)

  // Persist after every change (the reducer itself stays pure).
  useEffect(() => {
    cartStorage.set(state)
  }, [state])

  const cart = useMemo(() => new Cart(state.items, state.promoCode ?? null), [state])

  // addItem reads the latest items from a ref, so it can keep one identity for the whole life of the
  // provider. A stable function lets memoized children skip re-rendering when the cart changes.
  const itemsRef = useRef(state.items)
  useEffect(() => {
    itemsRef.current = state.items
  }, [state.items])

  const addItem = useCallback((product: CartProduct, qty = 1): AddItemResult => {
    const result = checkAddItem(itemsRef.current, product, qty)
    if (result.ok) dispatch({ type: 'ADD_ITEM', product, qty })
    return result
  }, [])

  const setQuantity = useCallback(
    (productId: number, qty: number) => dispatch({ type: 'SET_QTY', productId, qty }),
    [],
  )
  const removeItem = useCallback(
    (productId: number) => dispatch({ type: 'REMOVE_ITEM', productId }),
    [],
  )
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  const applyPromo = useCallback((code: string): boolean => {
    if (!Cart.isValidPromo(code)) return false
    dispatch({ type: 'APPLY_PROMO', code })
    return true
  }, [])
  const removePromo = useCallback(() => dispatch({ type: 'REMOVE_PROMO' }), [])

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      promoCode: state.promoCode ?? null,
      cart,
      itemCount: cart.itemCount,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      applyPromo,
      removePromo,
    }),
    [state, cart, addItem, setQuantity, removeItem, clearCart, applyPromo, removePromo],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside <CartProvider>')
  return context
}
