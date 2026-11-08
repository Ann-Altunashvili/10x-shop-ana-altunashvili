import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import TextField from '../components/ui/TextField'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { ordersStorage, reviewsStorage } from '../models/storage'
import type { Order } from '../types/order'
import type { ProfileFormValues } from '../types/user'
import { profileValidators } from '../utils/profileValidation'
import { hasErrors, validateForm } from '../utils/validation'

interface FieldConfig {
  name: keyof ProfileFormValues
  label: string
  type: string
  autoComplete: string
}

const FIELDS: readonly FieldConfig[] = [
  { name: 'firstName', label: 'First name', type: 'text', autoComplete: 'given-name' },
  { name: 'lastName', label: 'Last name', type: 'text', autoComplete: 'family-name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'phone', label: 'Phone (optional)', type: 'tel', autoComplete: 'tel' },
]

const NO_ORDERS: Order[] = []

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth()
  const { clearCart } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [orders, setOrders] = useLocalStorage(ordersStorage, NO_ORDERS)

  const [values, setValues] = useState<ProfileFormValues>(() => ({
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
  }))
  const [submitted, setSubmitted] = useState(false)
  const errors = useMemo(() => validateForm(values, profileValidators), [values])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    if (hasErrors(errors)) return

    updateProfile({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
    })
    showToast('Profile saved ✓')
  }

  // Cart, orders and reviews go; the login session and the theme stay.
  function handleClearData() {
    if (!window.confirm('Clear your cart, orders and reviews? This cannot be undone.')) return
    clearCart()
    setOrders([])
    reviewsStorage.remove()
    showToast('Local data cleared')
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Profile</h1>
        <p className="mt-1 text-muted">
          Signed in as <strong className="text-ink">{user.username}</strong> · {orders.length}{' '}
          {orders.length === 1 ? 'order' : 'orders'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Edit profile"
        className="space-y-4 rounded-2xl border border-line bg-surface p-5 sm:p-6"
      >
        <h2 className="text-xl font-bold">Your details</h2>
        {FIELDS.map((field) => (
          <TextField
            key={field.name}
            id={`profile-${field.name}`}
            name={field.name}
            type={field.type}
            label={field.label}
            autoComplete={field.autoComplete}
            value={values[field.name]}
            onChange={(event) => setValues((previous) => ({ ...previous, [field.name]: event.target.value }))}
            error={submitted ? errors[field.name] : undefined}
          />
        ))}
        <Button type="submit">Save changes</Button>
      </form>

      <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <h2 className="text-xl font-bold">Appearance</h2>
        <p className="mt-1 text-sm text-muted">Current theme: {theme}.</p>
        <Button variant="secondary" className="mt-3" onClick={toggleTheme}>
          Switch to {theme === 'dark' ? 'light' : 'dark'} theme
        </Button>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <h2 className="text-xl font-bold">Data on this device</h2>
        <p className="mt-1 text-sm text-muted">
          Removes your cart, orders and reviews from this browser. You stay logged in.
        </p>
        <Button variant="danger" className="mt-3" onClick={handleClearData}>
          Clear local data
        </Button>
      </section>

      <Button variant="secondary" onClick={handleLogout}>
        Log out
      </Button>
    </div>
  )
}
