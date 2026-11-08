import { isAuthUser } from '../utils/guards/user.guards'
import type { AuthUser } from '../types/user'
import { StorageService } from './StorageService'

/** The localStorage registry of the app. */
export const STORAGE_KEYS = {
  user: 'shop_user',
} as const

export const userStorage = new StorageService<AuthUser>(STORAGE_KEYS.user, isAuthUser)
