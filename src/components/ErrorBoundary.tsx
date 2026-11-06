import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  /** When this value changes, a previous error is cleared (e.g. the route changed). */
  resetKey?: string
}

interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * Error boundaries must be classes: there is no hook for getDerivedStateFromError.
 * A crash while rendering a child shows the fallback instead of a blank screen.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled UI error:', error, info.componentStack)
  }

  componentDidUpdate(previous: ErrorBoundaryProps): void {
    if (this.state.hasError && previous.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false })
    }
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        role="alert"
        className="mx-auto max-w-lg rounded-2xl border border-danger/40 bg-danger-soft p-8 text-center"
      >
        <h2 className="text-xl font-semibold text-danger">Something went wrong.</h2>
        <p className="mt-2 text-ink">The page hit an unexpected error. Reloading usually fixes it.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-5 inline-flex h-11 items-center rounded-lg bg-brand px-5 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Reload
        </button>
      </div>
    )
  }
}
