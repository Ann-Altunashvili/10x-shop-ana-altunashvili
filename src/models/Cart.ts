import type { CartItem } from '../types/cart'
import { discountedPrice, round2 } from '../utils/format'

export interface ICart {
  subtotal(): number
  discount(): number
  shipping(): number
  total(): number
}

/** All cart arithmetic lives here - no React, so it is easy to reason about and to test. */
export class Cart implements ICart {
  static readonly PROMO_CODE = '10X10'
  static readonly PROMO_RATE = 0.1
  static readonly FREE_SHIPPING_FROM = 100
  static readonly SHIPPING_COST = 10

  constructor(
    private readonly items: readonly CartItem[],
    private readonly promoCode: string | null = null,
  ) {}

  /** Promo codes are case-insensitive. */
  static isValidPromo(code: string): boolean {
    return code.trim().toUpperCase() === Cart.PROMO_CODE
  }

  static unitPrice(item: CartItem): number {
    return discountedPrice(item.price, item.discountPercentage)
  }

  static lineTotal(item: CartItem): number {
    return round2(Cart.unitPrice(item) * item.quantity)
  }

  get itemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0)
  }

  get isEmpty(): boolean {
    return this.items.length === 0
  }

  get hasPromo(): boolean {
    return this.promoCode !== null && Cart.isValidPromo(this.promoCode)
  }

  /** The code that is actually in effect, or null. */
  get appliedPromo(): string | null {
    return this.hasPromo ? Cart.PROMO_CODE : null
  }

  get lineItems(): readonly CartItem[] {
    return this.items
  }

  subtotal(): number {
    return round2(this.items.reduce((sum, item) => sum + Cart.lineTotal(item), 0))
  }

  discount(): number {
    return this.hasPromo ? round2(this.subtotal() * Cart.PROMO_RATE) : 0
  }

  /** Free from $100 (after the promo discount); an empty cart ships nothing. */
  shipping(): number {
    if (this.isEmpty) return 0
    return this.subtotal() - this.discount() >= Cart.FREE_SHIPPING_FROM ? 0 : Cart.SHIPPING_COST
  }

  total(): number {
    return round2(this.subtotal() - this.discount() + this.shipping())
  }
}
