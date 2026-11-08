import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import OrderStatusBadge from '../components/orders/OrderStatusBadge'
import { buttonStyles } from '../components/ui/buttonStyles'
import EmptyState from '../components/ui/EmptyState'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getOrderStatus } from '../models/Order'
import { ordersStorage } from '../models/storage'
import type { Order } from '../types/order'
import { formatDate, formatPrice } from '../utils/format'

const NO_ORDERS: Order[] = []

export default function OrdersPage() {
  const [orders] = useLocalStorage(ordersStorage, NO_ORDERS)

  // Statuses are computed from the clock, so the page re-reads the clock every 30 seconds.
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(timer) // without this the timer would keep running after leaving the page
  }, [])

  const newestFirst = [...orders].sort((a, b) => b.id - a.id)

  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold">Orders</h1>

      {newestFirst.length === 0 ? (
        <EmptyState title="You have no orders yet." description="Orders you place will appear here.">
          <Link to="/" className={buttonStyles('primary')}>
            Browse products
          </Link>
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {newestFirst.map((order) => {
            const itemCount = order.items.reduce((count, item) => count + item.quantity, 0)
            return (
              <li key={order.id}>
                <Link
                  to={`/orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-brand"
                >
                  <div>
                    <p className="font-display text-lg font-bold">#{order.number}</p>
                    <p className="text-sm text-muted">
                      {formatDate(order.placedAt)} · {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <OrderStatusBadge status={getOrderStatus(order.placedAt, now)} />
                    <p className="font-display text-lg font-bold tabular-nums">{formatPrice(order.total)}</p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
