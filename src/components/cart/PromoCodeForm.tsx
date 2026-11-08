import { useState, type FormEvent } from 'react'
import Button from '../ui/Button'
import { fieldStyles } from '../ui/fieldStyles'

interface PromoCodeFormProps {
  promoCode: string | null
  /** Returns true when the code is valid and has been applied. */
  onApply: (code: string) => boolean
  onRemove: () => void
}

export default function PromoCodeForm({ promoCode, onApply, onRemove }: PromoCodeFormProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (onApply(code)) {
      setCode('')
      setError(null)
    } else {
      setError('Invalid promo code')
    }
  }

  if (promoCode) {
    return (
      <p className="flex items-center justify-between gap-3 border-t border-line pt-4 text-sm">
        <span>
          Promo code <strong>{promoCode}</strong> applied
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="rounded font-medium text-brand underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-brand"
        >
          Remove
        </button>
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="border-t border-line pt-4">
      <label htmlFor="promo-code" className="mb-1.5 block text-sm font-medium">
        Promo code
      </label>
      <div className="flex gap-2">
        <input
          id="promo-code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'promo-error' : undefined}
          autoComplete="off"
          className={`h-11 min-w-0 flex-1 ${fieldStyles(Boolean(error))}`}
        />
        <Button type="submit" variant="secondary">
          Apply
        </Button>
      </div>
      {error && (
        <p id="promo-error" role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </form>
  )
}
