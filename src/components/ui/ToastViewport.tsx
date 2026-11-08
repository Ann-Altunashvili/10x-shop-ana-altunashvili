export type ToastKind = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  message: string
  kind: ToastKind
}

interface ToastViewportProps {
  toasts: ToastItem[]
  onDismiss: (id: number) => void
}

const kindStyles: Record<ToastKind, string> = {
  success: 'border-ok/50',
  error: 'border-danger/60',
  info: 'border-brand/50',
}

/** Where toasts are drawn. aria-live makes screen readers announce each new message. */
export default function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.kind === 'error' ? 'alert' : 'status'}
          className={`pointer-events-auto flex max-w-md animate-toast-in items-start gap-3 rounded-xl border bg-surface px-4 py-3 text-sm font-medium shadow-lg ${kindStyles[toast.kind]}`}
        >
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            className="-my-1 -mr-2 grid size-8 shrink-0 place-items-center rounded-lg text-muted hover:bg-sunken hover:text-ink"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
