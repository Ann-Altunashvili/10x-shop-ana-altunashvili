import { Link } from 'react-router-dom'
import { buttonStyles } from '../components/ui/buttonStyles'

/** Shown for unknown URLs, and also for a product or order that does not exist. */
export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-md py-16 text-center">
      <p className="font-display text-7xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted">The page you are looking for does not exist.</p>
      <Link to="/" className={`${buttonStyles('primary', 'lg')} mt-6`}>
        Go to catalog
      </Link>
    </section>
  )
}
