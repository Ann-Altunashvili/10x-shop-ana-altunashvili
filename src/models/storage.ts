import { isCartState } from '../utils/guards/cart.guards'
import { isAuthUser } from '../utils/guards/user.guards'
import type { CartState } from '../types/cart'
import type { AuthUser } from '../types/user'
import { StorageService } from './StorageService'

/** The localStorage registry of the app. */
export const STORAGE_KEYS = {
  cart: 'shop_cart',
  user: 'shop_user',
} as const

export const cartStorage = new StorageService<CartState>(STORAGE_KEYS.cart, isCartState)
export const userStorage = new StorageService<AuthUser>(STORAGE_KEYS.user, isAuthUser)
