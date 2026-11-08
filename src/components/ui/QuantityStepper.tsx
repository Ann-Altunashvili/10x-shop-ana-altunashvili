interface QuantityStepperProps {
  value: number
  min?: number
  max: number
  onChange: (value: number) => void
  /** Used in the accessible names: "Decrease quantity of Watch". */
  label: string
  disabled?: boolean
}

const stepButton =
  'grid size-11 place-items-center text-lg font-semibold transition-colors ' +
  'enabled:hover:bg-sunken focus-visible:outline-2 focus-visible:-outline-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-40'

export default function QuantityStepper({
  value,
  min = 1,
  max,
  onChange,
  label,
  disabled = false,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-lg border border-line bg-surface">
      <button
        type="button"
        className={stepButton}
        aria-label={`Decrease quantity of ${label}`}
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <output aria-live="polite" className="min-w-10 text-center font-semibold tabular-nums">
        {value}
      </output>
      <button
        type="button"
        className={stepButton}
        aria-label={`Increase quantity of ${label}`}
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  )
}
