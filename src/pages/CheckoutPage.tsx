import { useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import CartSummary from '../components/cart/CartSummary'
import Button from '../components/ui/Button'
import { buttonStyles } from '../components/ui/buttonStyles'
import TextField from '../components/ui/TextField'
import { useCart } from '../context/CartContext'
import { Cart } from '../models/Cart'
import type { CartItem } from '../types/cart'
import type { ShippingInfo } from '../types/order'
import { delay } from '../utils/delay'
import { formatPrice } from '../utils/format'
import { checkoutValidators, validateForm } from '../utils/validation'

interface FieldConfig {
  name: keyof ShippingInfo
  label: string
  type: string
  autoComplete: string
}

const FIELDS: readonly FieldConfig[] = [
  { name: 'fullName', label: 'Full name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'address', label: 'Address', type: 'text', autoComplete: 'street-address' },
  { name: 'city', label: 'City', type: 'text', autoComplete: 'address-level2' },
]

/** What the "Thank you" screen needs: a snapshot taken before the cart is emptied. */
interface Confirmation {
  items: CartItem[]
  total: number
  shipping: ShippingInfo
}

export default function CheckoutPage() {
  const { items, cart, clearCart } = useCart()

  // Controlled form: every input value lives in React state.
  const [values, setValues] = useState<ShippingInfo>({ fullName: '', email: '', address: '', city: '' })
  const [touched, setTouched] = useState<Partial<Record<keyof ShippingInfo, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)

  const errors = useMemo(() => validateForm(values, checkoutValidators), [values])

  function updateField(field: keyof ShippingInfo, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }))
  }

  // An error is shown after the field was left (blur) or after the first submit attempt.
  function visibleError(field: keyof ShippingInfo): string | undefined {
    return submitted || touched[field] ? errors[field] : undefined
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault() // no page reload
    setSubmitted(true)

    const firstInvalid = FIELDS.find((field) => errors[field.name])
    if (firstInvalid) {
      document.getElementById(`checkout-${firstInvalid.name}`)?.focus()
      return
    }

    setPlacing(true) // disables the button: no double orders
    await delay(700) // the order is only simulated, a short pause makes that visible
    setConfirmation({ items: [...cart.lineItems], total: cart.total(), shipping: values })
    clearCart()
    setPlacing(false)
  }

  if (confirmation) {
    return (
      <section className="mx-auto max-w-2xl" aria-labelledby="thanks-heading">
        <div className="rounded-2xl border border-ok/40 bg-ok-soft p-6">
          <h1 id="thanks-heading" className="text-3xl font-bold text-ok">
            Thank you! Your order has been placed.
          </h1>
          <p className="mt-2 text-ink">
            Total <strong className="tabular-nums">{formatPrice(confirmation.total)}</strong>
          </p>
        </div>

        <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface">
          {confirmation.items.map((item) => (
            <li key={item.productId} className="flex items-center justify-between gap-4 p-4">
              <span>
                {item.title} <span className="text-muted">× {item.quantity}</span>
              </span>
              <span className="font-semibold tabular-nums">{formatPrice(Cart.lineTotal(item))}</span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-sm text-muted">
          Shipping to {confirmation.shipping.fullName}, {confirmation.shipping.address},{' '}
          {confirmation.shipping.city}.
        </p>

        <div className="mt-6">
          <Link to="/" className={buttonStyles('primary')}>
            Continue shopping
          </Link>
        </div>
      </section>
    )
  }

  if (items.length === 0) return <Navigate to="/cart" replace />

  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold">Checkout</h1>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-label="Shipping details"
          className="space-y-4 rounded-2xl border border-line bg-surface p-5 sm:p-6"
        >
          <h2 className="text-xl font-bold">Shipping details</h2>

          {FIELDS.map((field) => (
            <TextField
              key={field.name}
              id={`checkout-${field.name}`}
              name={field.name}
              type={field.type}
              label={field.label}
              autoComplete={field.autoComplete}
              value={values[field.name]}
              onChange={(event) => updateField(field.name, event.target.value)}
              onBlur={() => setTouched((previous) => ({ ...previous, [field.name]: true }))}
              error={visibleError(field.name)}
            />
          ))}

          <Button type="submit" size="lg" className="w-full" disabled={placing}>
            {placing ? 'Placing order…' : 'Place order'}
          </Button>
        </form>

        <CartSummary cart={cart} />
      </div>
    </div>
  )
}
