import { isCartState } from '../utils/guards/cart.guards'
import { isOrderList } from '../utils/guards/order.guards'
import { isReviewsMap, type ReviewsMap } from '../utils/guards/review.guards'
import { isAuthUser, isTheme } from '../utils/guards/user.guards'
import type { CartState } from '../types/cart'
import type { Order } from '../types/order'
import type { Theme } from '../types/theme'
import type { AuthUser } from '../types/user'
import { StorageService } from './StorageService'

/** The localStorage registry of the app. */
export const STORAGE_KEYS = {
  cart: 'shop_cart',
  user: 'shop_user',
  orders: 'shop_orders',
  reviews: 'shop_reviews',
  theme: 'shop_theme',
} as const

export const cartStorage = new StorageService<CartState>(STORAGE_KEYS.cart, isCartState)
export const userStorage = new StorageService<AuthUser>(STORAGE_KEYS.user, isAuthUser)
export const ordersStorage = new StorageService<Order[]>(STORAGE_KEYS.orders, isOrderList)
export const reviewsStorage = new StorageService<ReviewsMap>(STORAGE_KEYS.reviews, isReviewsMap)
export const themeStorage = new StorageService<Theme>(STORAGE_KEYS.theme, isTheme)
