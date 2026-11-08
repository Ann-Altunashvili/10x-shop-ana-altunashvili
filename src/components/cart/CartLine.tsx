import { Link } from 'react-router-dom'
import { Cart } from '../../models/Cart'
import type { CartItem } from '../../types/cart'
import { formatPrice } from '../../utils/format'
import Button from '../ui/Button'
import QuantityStepper from '../ui/QuantityStepper'

interface CartLineProps {
  item: CartItem
  onQuantityChange: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
}

/**
 * Mobile: photo | title | Remove on the first row, stepper + line total on the second.
 * From 640px everything sits on one row (the Remove button is moved last with `order`).
 */
export default function CartLine({ item, onQuantityChange, onRemove }: CartLineProps) {
  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:items-center">
      <Link
        to={`/products/${item.productId}`}
        className="size-20 overflow-hidden rounded-lg bg-sunken sm:size-24"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={item.thumbnail}
          alt=""
          width={96}
          height={96}
          loading="lazy"
          className="size-full object-contain p-1"
        />
      </Link>

      <div className="min-w-0">
        <Link
          to={`/products/${item.productId}`}
          className="font-semibold hover:text-brand focus-visible:outline-2 focus-visible:outline-brand"
        >
          {item.title}
        </Link>
        <p className="mt-1 text-sm text-muted tabular-nums">{formatPrice(Cart.unitPrice(item))} each</p>
        {item.quantity === item.stock && (
          <p className="mt-1 text-sm text-warn">All {item.stock} in stock are in your cart.</p>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="text-danger sm:order-4"
        onClick={() => onRemove(item.productId)}
        aria-label={`Remove ${item.title} from cart`}
      >
        Remove
      </Button>

      <div className="col-span-3 flex items-center justify-between gap-4 sm:col-span-1 sm:justify-end">
        <QuantityStepper
          value={item.quantity}
          max={item.stock}
          label={item.title}
          onChange={(quantity) => onQuantityChange(item.productId, quantity)}
        />
        <p className="min-w-20 text-right font-display text-lg font-bold tabular-nums">
          {formatPrice(Cart.lineTotal(item))}
        </p>
      </div>
    </li>
  )
}
