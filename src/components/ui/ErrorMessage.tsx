import Button from './Button'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="mx-auto max-w-lg rounded-2xl border border-danger/40 bg-danger-soft p-6 text-center"
    >
      <h2 className="text-lg font-semibold text-danger">We couldn’t load this page</h2>
      <p className="mt-2 text-ink">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
