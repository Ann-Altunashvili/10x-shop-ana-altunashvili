interface StarRatingProps {
  value: number
  /** Show the number next to the stars: "★ 4.7". */
  showValue?: boolean
}

/** Five stars, rounded to the nearest whole star, with a text alternative for screen readers. */
export default function StarRating({ value, showValue = false }: StarRatingProps) {
  const filled = Math.round(value)

  return (
    <span className="inline-flex items-center gap-1.5" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      <span aria-hidden="true" className="tracking-tight text-star">
        {Array.from({ length: 5 }, (_, index) => (index < filled ? '★' : '☆')).join('')}
      </span>
      {showValue && (
        <span aria-hidden="true" className="text-sm font-medium tabular-nums">
          {value.toFixed(1)}
        </span>
      )}
    </span>
  )
}
