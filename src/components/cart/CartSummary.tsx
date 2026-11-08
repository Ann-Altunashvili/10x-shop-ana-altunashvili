import type { ReactNode } from 'react'
import { Cart } from '../../models/Cart'
import { formatPrice } from '../../utils/format'

interface CartSummaryProps {
  cart: Cart
  /** Extra content under the totals: the promo form, the checkout button... */
  children?: ReactNode
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? 'text-lg font-bold' : 'text-sm'}`}>
      <dt className={strong ? '' : 'text-muted'}>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  )
}

/** Subtotal, discount, shipping and total of a Cart. Pure display: all arithmetic is in the Cart class. */
export default function CartSummary({ cart, children }: CartSummaryProps) {
  const shipping = cart.shipping()

  return (
    <section aria-labelledby="summary-heading" className="rounded-2xl border border-line bg-surface p-5">
      <h2 id="summary-heading" className="mb-4 text-xl font-bold">
        Order summary
      </h2>

      <dl className="space-y-2">
        <Row label="Subtotal" value={formatPrice(cart.subtotal())} />
        {cart.hasPromo && (
          <Row
            label={`Discount (${Cart.PROMO_CODE} −${Math.round(Cart.PROMO_RATE * 100)}%)`}
            value={`−${formatPrice(cart.discount())}`}
          />
        )}
        <Row label="Shipping" value={shipping === 0 ? 'Free' : formatPrice(shipping)} />
        <div className="my-3 border-t border-line" />
        <Row label="Total" value={formatPrice(cart.total())} strong />
      </dl>
      <p className="mt-2 text-xs text-muted">
        Free shipping from {formatPrice(Cart.FREE_SHIPPING_FROM)}.
      </p>

      {children && <div className="mt-5 space-y-5">{children}</div>}
    </section>
  )
}
