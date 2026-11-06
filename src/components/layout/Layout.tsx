import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import ErrorBoundary from '../ErrorBoundary'
import Spinner from '../ui/Spinner'
import Footer from './Footer'
import Header from './Header'
import ScrollToTop from './ScrollToTop'

/** The shared frame: every page is rendered inside <Outlet />. */
export default function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-on-brand"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <Header />
      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {/* resetKey: leaving a crashed page gives the next page a fresh start */}
        <ErrorBoundary resetKey={pathname}>
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
