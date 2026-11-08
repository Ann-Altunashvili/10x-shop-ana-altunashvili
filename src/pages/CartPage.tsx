import { Link } from 'react-router-dom'
import CartLine from '../components/cart/CartLine'
import CartSummary from '../components/cart/CartSummary'
import Button from '../components/ui/Button'
import { buttonStyles } from '../components/ui/buttonStyles'
import EmptyState from '../components/ui/EmptyState'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function CartPage() {
  const { items, cart, setQuantity, removeItem, clearCart } = useCart()
  const { showToast } = useToast()

  function handleRemove(productId: number) {
    removeItem(productId)
    showToast('Removed from cart')
  }

  function handleClear() {
    if (window.confirm('Clear the cart? This cannot be undone.')) clearCart()
  }

  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold">Cart</h1>

      {items.length === 0 ? (
        <EmptyState title="Your cart is empty." description="Add a product and it will show up here.">
          <Link to="/" className={buttonStyles('primary')}>
            Browse products
          </Link>
        </EmptyState>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
          <section aria-label="Items in your cart">
            <ul className="space-y-3">
              {items.map((item) => (
                <CartLine
                  key={item.productId}
                  item={item}
                  onQuantityChange={setQuantity}
                  onRemove={handleRemove}
                />
              ))}
            </ul>
            <Button variant="danger" size="sm" className="mt-4" onClick={handleClear}>
              Clear cart
            </Button>
          </section>

          <CartSummary cart={cart} />
        </div>
      )}
    </div>
  )
}
