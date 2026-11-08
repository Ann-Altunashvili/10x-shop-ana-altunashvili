import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Guards a group of routes. A guest is sent to /login and remembers where they wanted to go
 * (`from`), so the login page can bring them back. This is a UI convenience, not real security.
 */
export default function ProtectedRoute() {
  const { isLoggedIn } = useAuth()
  const { pathname } = useLocation()

  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: pathname }} />
  return <Outlet />
}
