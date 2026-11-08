import type { AuthUser } from '../types/user'

/** The name shown in the header and on reviews. */
export function getDisplayName(user: AuthUser): string {
  return user.firstName?.trim() || user.username
}

/** "Anna Smith" when both names exist, otherwise whatever is available. */
export function getFullName(user: AuthUser): string {
  return [user.firstName, user.lastName].filter(Boolean).join(' ')
}
