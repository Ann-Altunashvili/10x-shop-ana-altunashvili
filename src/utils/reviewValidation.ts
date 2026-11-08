import type { Validators } from './validation'

export interface ReviewFormValues {
  rating: number // 0 = not selected yet
  comment: string
}

export const reviewValidators: Validators<ReviewFormValues> = {
  rating: (value) =>
    Number.isInteger(value) && value >= 1 && value <= 5 ? undefined : 'Please select a rating',
  comment: (value) =>
    value.trim().length >= 10 ? undefined : 'Comment must be at least 10 characters',
}
