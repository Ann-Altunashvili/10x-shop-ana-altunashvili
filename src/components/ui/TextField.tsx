import type { ComponentPropsWithoutRef } from 'react'
import { fieldStyles } from './fieldStyles'

interface TextFieldProps extends Omit<ComponentPropsWithoutRef<'input'>, 'id'> {
  id: string
  label: string
  error?: string
}

/** Label + input + inline error, wired together for screen readers. */
export default function TextField({ id, label, error, className = '', ...inputProps }: TextFieldProps) {
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`h-11 ${fieldStyles(Boolean(error))} ${className}`}
        {...inputProps}
      />
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
