import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CartIcon, CloseIcon, MenuIcon } from '../ui/Icons'

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
  'inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors ' +
  'hover:bg-sunken focus-visible:outline-2 focus-visible:outline-brand ' +
  (isActive ? 'bg-brand-soft text-brand' : 'text-ink')

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  const links = (
    <>
      <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
        Catalog
      </NavLink>
      <NavLink to="/cart" className={navLinkClass} onClick={closeMenu}>
        <CartIcon />
        Cart
      </NavLink>
    </>
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
        </div>
      )}
    </header>
  )
}
