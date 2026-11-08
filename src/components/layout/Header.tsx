import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { getDisplayName } from '../../utils/user'
import Button from '../ui/Button'
import { buttonStyles } from '../ui/buttonStyles'
import { CartIcon, CloseIcon, MenuIcon } from '../ui/Icons'

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
  'inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors ' +
  'hover:bg-sunken focus-visible:outline-2 focus-visible:outline-brand ' +
  (isActive ? 'bg-brand-soft text-brand' : 'text-ink')

export default function Header() {
  const { itemCount } = useCart()
  const { user, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  function handleLogout() {
    logout()
    closeMenu()
    navigate('/') // the cart is NOT cleared on logout
  }

  const links = (
    <>
      <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
        Catalog
      </NavLink>
      <NavLink to="/cart" className={navLinkClass} onClick={closeMenu}>
        <CartIcon />
        Cart
        {itemCount > 0 && (
          <span className="grid min-w-5 place-items-center rounded-full bg-brand px-1.5 text-xs font-bold text-on-brand tabular-nums">
            {itemCount}
            <span className="sr-only">{itemCount === 1 ? ' item' : ' items'} in cart</span>
          </span>
        )}
      </NavLink>
    </>
  )

  const accountActions = isLoggedIn ? (
    <>
      <span className="hidden text-sm text-muted lg:inline">Hi, {getDisplayName(user)}</span>
      <Button variant="secondary" onClick={handleLogout}>
        Log out
      </Button>
    </>
  ) : (
    <Link to="/login" className={buttonStyles('primary')} onClick={closeMenu}>
      Log in
    </Link>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link
          to="/"
          onClick={closeMenu}
          className="mr-2 flex min-h-11 items-center gap-2 rounded-lg font-display text-xl font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-brand"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-brand text-sm text-on-brand">
            10X
          </span>
          <span>Shop</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-3 md:flex">{accountActions}</div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="grid size-11 place-items-center rounded-lg transition-colors hover:bg-sunken focus-visible:outline-2 focus-visible:outline-brand md:hidden"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-line bg-surface px-4 pb-4 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1 py-3">
            {links}
          </nav>
          <div className="flex items-center gap-3">{accountActions}</div>
        </div>
      )}
    </header>
  )
}
