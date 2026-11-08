import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { userStorage } from '../models/storage'
import type { AuthUser, ProfileFormValues } from '../types/user'

interface AuthContextValue {
  user: AuthUser
  isLoggedIn: boolean
  login: (username: string) => void
  logout: () => void
  updateProfile: (changes: Partial<ProfileFormValues>) => void
}

const GUEST: AuthUser = { username: '', isLoggedIn: false }

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * A local login simulation: there is no server and no password check.
 * Only the username (and optional profile fields) is remembered, never the password.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(() => userStorage.get() ?? GUEST)

  useEffect(() => {
    if (user.isLoggedIn) userStorage.set(user)
    else userStorage.remove()
  }, [user])

  const login = useCallback((username: string) => {
    setUser({ username, isLoggedIn: true })
  }, [])

  const logout = useCallback(() => setUser(GUEST), [])

  const updateProfile = useCallback((changes: Partial<ProfileFormValues>) => {
    setUser((previous) => ({ ...previous, ...changes }))
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoggedIn: user.isLoggedIn, login, logout, updateProfile }),
    [user, login, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
  return context
}
