import { useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import CartSummary from '../components/cart/CartSummary'
import Button from '../components/ui/Button'
import { buttonStyles } from '../components/ui/buttonStyles'
import TextField from '../components/ui/TextField'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Cart } from '../models/Cart'
import { OrderModel } from '../models/Order'
import { ordersStorage } from '../models/storage'
import type { Order, ShippingInfo } from '../types/order'
import { delay } from '../utils/delay'
import { formatPrice } from '../utils/format'
import { checkoutValidators, validateForm } from '../utils/validation'
import { getFullName } from '../utils/user'

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

const NO_ORDERS: Order[] = []

export default function CheckoutPage() {
  const { items, cart, clearCart } = useCart()
  const { user } = useAuth()
  const [orders, setOrders] = useLocalStorage(ordersStorage, NO_ORDERS)

  // Controlled form: every input value lives in React state.
  const [values, setValues] = useState<ShippingInfo>(() => ({
    fullName: getFullName(user),
    email: user.email ?? '',
    address: '',
    city: '',
  }))
  const [touched, setTouched] = useState<Partial<Record<keyof ShippingInfo, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null)

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
    setSubmitError(null)
    try {
      await delay(700) // the order is only simulated, a short pause makes that visible
      const order = OrderModel.create(cart, values, orders.length + 1).toJSON()
      setOrders((previous) => [order, ...previous])
      clearCart()
      setPlacedOrder(order)
    } catch {
      // The form values stay in state, so the customer does not have to type again.
      setSubmitError('We couldn’t place your order. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  if (placedOrder) {
    return (
      <section className="mx-auto max-w-2xl" aria-labelledby="thanks-heading">
        <div className="rounded-2xl border border-ok/40 bg-ok-soft p-6">
          <h1 id="thanks-heading" className="text-3xl font-bold text-ok">
            Thank you! Your order has been placed.
          </h1>
          <p className="mt-2 text-ink">
            Order <strong>#{placedOrder.number}</strong> · Total{' '}
            <strong className="tabular-nums">{formatPrice(placedOrder.total)}</strong>
          </p>
        </div>

        <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface">
          {placedOrder.items.map((item) => (
            <li key={item.productId} className="flex items-center justify-between gap-4 p-4">
              <span>
                {item.title} <span className="text-muted">× {item.quantity}</span>
              </span>
              <span className="font-semibold tabular-nums">{formatPrice(Cart.lineTotal(item))}</span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-sm text-muted">
          Shipping to {placedOrder.shipping.fullName}, {placedOrder.shipping.address},{' '}
          {placedOrder.shipping.city}.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={`/orders/${placedOrder.id}`}
            state={{ justPlaced: true }}
            className={buttonStyles('primary')}
          >
            View order
          </Link>
          <Link to="/" className={buttonStyles('secondary')}>
            Continue shopping
          </Link>
        </div>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <Navigate
        to="/cart"
        replace
        state={{ notice: 'Your cart is empty. Add something before checking out.' }}
      />
    )
  }

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

          {submitError && (
            <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
              {submitError}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={placing}>
            {placing ? 'Placing order…' : 'Place order'}
          </Button>
        </form>

        <CartSummary cart={cart} />
      </div>
    </div>
  )
}
