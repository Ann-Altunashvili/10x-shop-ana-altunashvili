import type { Theme } from '../../types/theme'
import type { AuthUser } from '../../types/user'
import { isOptionalString, isRecord } from './common'

export function isAuthUser(value: unknown): value is AuthUser {
  return (
    isRecord(value) &&
    typeof value.username === 'string' &&
    typeof value.isLoggedIn === 'boolean' &&
    isOptionalString(value.firstName) &&
    isOptionalString(value.lastName) &&
    isOptionalString(value.email) &&
    isOptionalString(value.phone)
  )
}

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}
