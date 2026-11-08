import { useMemo, useState, type FormEvent } from 'react'
import { fieldStyles } from '../ui/fieldStyles'
import Button from '../ui/Button'
import { reviewValidators, type ReviewFormValues } from '../../utils/reviewValidation'
import { hasErrors, validateForm } from '../../utils/validation'

interface ReviewFormProps {
  onSubmit: (values: ReviewFormValues) => void
}

const EMPTY_VALUES: ReviewFormValues = { rating: 0, comment: '' }

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [values, setValues] = useState<ReviewFormValues>(EMPTY_VALUES)
  const [submitted, setSubmitted] = useState(false)
  const errors = useMemo(() => validateForm(values, reviewValidators), [values])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    if (hasErrors(errors)) return

    onSubmit(values)
    setValues(EMPTY_VALUES) // the form is cleared after a successful submit
    setSubmitted(false)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-xl border border-line bg-surface p-4">
      <h3 className="text-lg font-semibold">Write a review</h3>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">Your rating</legend>
        <div className="flex gap-1" role="radiogroup" aria-describedby={submitted && errors.rating ? 'review-rating-error' : undefined}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={values.rating === star}
              aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
              onClick={() => setValues((previous) => ({ ...previous, rating: star }))}
              className={`grid size-11 place-items-center rounded-lg text-2xl transition-colors hover:bg-sunken focus-visible:outline-2 focus-visible:outline-brand ${
                star <= values.rating ? 'text-star' : 'text-muted'
              }`}
            >
              {star <= values.rating ? '★' : '☆'}
            </button>
          ))}
        </div>
        {submitted && errors.rating && (
          <p id="review-rating-error" role="alert" className="mt-1.5 text-sm text-danger">
            {errors.rating}
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor="review-comment" className="mb-1.5 block text-sm font-medium">
          Comment
        </label>
        <textarea
          id="review-comment"
          rows={4}
          value={values.comment}
          onChange={(event) => setValues((previous) => ({ ...previous, comment: event.target.value }))}
          aria-invalid={submitted && errors.comment ? true : undefined}
          aria-describedby={submitted && errors.comment ? 'review-comment-error' : undefined}
          className={`py-2 ${fieldStyles(submitted && Boolean(errors.comment))}`}
        />
        {submitted && errors.comment && (
          <p id="review-comment-error" role="alert" className="mt-1.5 text-sm text-danger">
            {errors.comment}
          </p>
        )}
      </div>

      <Button type="submit">Submit review</Button>
    </form>
  )
}
