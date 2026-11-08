import type { ShippingInfo } from '../types/order'

/** { fullName: "..." } -> errors for the fields that failed. */
export type FormErrors<T> = Partial<Record<keyof T, string>>

/** One validator per field: returns an error message, or undefined when the value is fine. */
export type Validators<T> = { [K in keyof T]: (value: T[K]) => string | undefined }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

/** 9-15 digits; a leading "+", spaces and dashes are allowed. */
export function isValidPhone(value: string): boolean {
  const trimmed = value.trim()
  if (!/^\+?[\d\s-]+$/.test(trimmed)) return false
  const digits = trimmed.replace(/\D/g, '')
  return digits.length >= 9 && digits.length <= 15
}

export function validateForm<T extends object>(values: T, validators: Validators<T>): FormErrors<T> {
  const errors: FormErrors<T> = {}
  for (const field of Object.keys(validators) as Array<keyof T>) {
    const message = validators[field](values[field])
    if (message) errors[field] = message
  }
  return errors
}

export function hasErrors<T>(errors: FormErrors<T>): boolean {
  return Object.keys(errors).length > 0
}

export const checkoutValidators: Validators<ShippingInfo> = {
  fullName: (value) =>
    value.trim().length >= 3 ? undefined : 'Full name must be at least 3 characters',
  email: (value) => (isValidEmail(value) ? undefined : 'Please enter a valid email address'),
  address: (value) => (value.trim().length >= 5 ? undefined : 'Address must be at least 5 characters'),
  city: (value) => (value.trim().length > 0 ? undefined : 'City is required'),
}
