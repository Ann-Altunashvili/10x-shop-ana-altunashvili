import type { ProfileFormValues } from '../types/user'
import { isValidEmail, isValidPhone, type Validators } from './validation'

export const profileValidators: Validators<ProfileFormValues> = {
  firstName: (value) =>
    value.trim().length >= 2 ? undefined : 'First name must be at least 2 characters',
  lastName: (value) =>
    value.trim().length >= 2 ? undefined : 'Last name must be at least 2 characters',
  email: (value) => (isValidEmail(value) ? undefined : 'Please enter a valid email address'),
  // Optional: an empty phone is fine, a filled one must look like a phone number.
  phone: (value) =>
    value.trim() === '' || isValidPhone(value) ? undefined : 'Please enter a valid phone number',
}
