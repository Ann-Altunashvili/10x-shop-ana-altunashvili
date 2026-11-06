import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** A new route should open at the top of the page, like a real page load. Renders nothing. */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
