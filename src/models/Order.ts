import type { Order, OrderStatus, ShippingInfo } from '../types/order'
import type { Cart } from './Cart'

/**
 * Status is never stored - it is computed from the time passed since the order was placed:
 * under 1 minute Processing, 1-3 minutes Shipped, later Delivered.
 * A pure function: same input, same answer.
 */
export function getOrderStatus(placedAt: string, now: Date = new Date()): OrderStatus {
  const minutes = (now.getTime() - new Date(placedAt).getTime()) / 60_000
  if (minutes < 1) return 'Processing'
  if (minutes <= 3) return 'Shipped'
  return 'Delivered'
}

export class OrderModel {
  private constructor(private readonly data: Order) {}

  /** Static factory: turns the current cart + the checkout form into an order. */
  static create(
    cart: Cart,
    shipping: ShippingInfo,
    sequence: number,
    now: Date = new Date(),
  ): OrderModel {
    return new OrderModel({
      id: now.getTime(),
      number: `10X-${String(sequence).padStart(5, '0')}`,
      items: cart.lineItems.map((item) => ({ ...item })),
      shipping: {
        fullName: shipping.fullName.trim(),
        email: shipping.email.trim(),
        address: shipping.address.trim(),
        city: shipping.city.trim(),
      },
      subtotal: cart.subtotal(),
      discount: cart.discount(),
      shippingCost: cart.shipping(),
      total: cart.total(),
      promoCode: cart.appliedPromo,
      placedAt: now.toISOString(),
    })
  }

  getStatus(now: Date = new Date()): OrderStatus {
    return getOrderStatus(this.data.placedAt, now)
  }

  /** The plain object that goes to localStorage. */
  toJSON(): Order {
    return this.data
  }
}
