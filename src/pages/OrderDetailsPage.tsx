import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import OrderStatusBadge from '../components/orders/OrderStatusBadge'
import Button from '../components/ui/Button'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Cart } from '../models/Cart'
import { getOrderStatus } from '../models/Order'
import { ordersStorage } from '../models/storage'
import type { Order, OrderStatus } from '../types/order'
import { formatDate, formatPrice } from '../utils/format'
import { wasJustPlaced } from '../utils/routerState'
import NotFoundPage from './NotFoundPage'

const NO_ORDERS: Order[] = []
const TIMELINE: readonly OrderStatus[] = ['Processing', 'Shipped', 'Delivered']

export default function OrderDetailsPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [orders] = useLocalStorage(ordersStorage, NO_ORDERS)

  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(timer)
  }, [])

  const order = orders.find((candidate) => String(candidate.id) === id)
  if (!order) return <NotFoundPage />

  const status = getOrderStatus(order.placedAt, now)
  const reachedIndex = TIMELINE.indexOf(status)

  // Reorder: put every item of this order back into the cart (as far as stock allows).
  function handleReorder(source: Order) {
    const failed = source.items.filter(
      (item) =>
        !addItem(
          {
            id: item.productId,
            title: item.title,
            thumbnail: item.thumbnail,
            price: item.price,
            discountPercentage: item.discountPercentage,
            stock: item.stock,
          },
          item.quantity,
        ).ok,
    )

    if (failed.length === 0) showToast('Items added to cart ✓')
    else showToast('Some items could not be added because of limited stock.', 'error')
    navigate('/cart')
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/orders"
        className="mb-5 inline-flex min-h-11 items-center rounded-lg text-sm font-medium text-brand hover:underline focus-visible:outline-2 focus-visible:outline-brand"
      >
        ← All orders
      </Link>

      {wasJustPlaced(location.state) && (
        <p role="status" className="mb-6 rounded-xl border border-ok/40 bg-ok-soft px-4 py-3 font-medium text-ok">
          Thank you! Your order has been placed.
        </p>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.number}</h1>
          <p className="mt-1 text-muted">Placed on {formatDate(order.placedAt)}</p>
        </div>
        <OrderStatusBadge status={status} />
      </div>

      <ol aria-label="Order progress" className="mt-6 grid grid-cols-3 gap-2">
        {TIMELINE.map((step, index) => {
          const reached = index <= reachedIndex
          return (
            <li
              key={step}
              aria-current={step === status ? 'step' : undefined}
              className={`rounded-xl border p-3 text-center text-sm font-semibold ${
                reached ? 'border-ok/40 bg-ok-soft text-ok' : 'border-line bg-surface text-muted'
              }`}
            >
              <span aria-hidden="true">{reached ? '✓' : '○'} </span>
              {step}
            </li>
          )
        })}
      </ol>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
        <table className="w-full min-w-96 text-left text-sm">
          <caption className="sr-only">Items in this order</caption>
          <thead className="border-b border-line text-muted">
            <tr>
              <th scope="col" className="p-3 font-medium">Item</th>
              <th scope="col" className="p-3 text-right font-medium">Qty</th>
              <th scope="col" className="p-3 text-right font-medium">Price</th>
              <th scope="col" className="p-3 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {order.items.map((item) => (
              <tr key={item.productId}>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.thumbnail}
                      alt=""
                      width={48}
                      height={48}
                      loading="lazy"
                      className="size-12 shrink-0 rounded-lg bg-sunken object-contain"
                    />
                    <span className="font-medium">{item.title}</span>
                  </div>
                </td>
                <td className="p-3 text-right tabular-nums">{item.quantity}</td>
                <td className="p-3 text-right tabular-nums">{formatPrice(Cart.unitPrice(item))}</td>
                <td className="p-3 text-right font-semibold tabular-nums">{formatPrice(Cart.lineTotal(item))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-2 text-lg font-bold">Shipping address</h2>
          <address className="text-sm leading-relaxed not-italic">
            {order.shipping.fullName}
            <br />
            {order.shipping.address}
            <br />
            {order.shipping.city}
            <br />
            <span className="text-muted">{order.shipping.email}</span>
          </address>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-4">
          <h2 className="mb-2 text-lg font-bold">Totals</h2>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="tabular-nums">{formatPrice(order.subtotal)}</dd></div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">Discount{order.promoCode ? ` (${order.promoCode})` : ''}</dt>
                <dd className="tabular-nums">−{formatPrice(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd className="tabular-nums">{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</dd></div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-bold"><dt>Total</dt><dd className="tabular-nums">{formatPrice(order.total)}</dd></div>
          </dl>
        </section>
      </div>

      <Button size="lg" className="mt-6" onClick={() => handleReorder(order)}>
        Reorder
      </Button>
    </div>
  )
}
