import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import type { Product } from '../../types/product'
import { formatCategory } from '../../utils/format'
import Button from '../ui/Button'
import QuantityStepper from '../ui/QuantityStepper'
import StarRating from '../ui/StarRating'
import Gallery from './Gallery'
import PriceBlock from './PriceBlock'
import StockBadge from './StockBadge'

export default function ProductDetails({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [quantity, setQuantity] = useState(1)

  const outOfStock = product.stock === 0

  // Opened from a link on another site (no history to go back to)? Go to the catalog instead.
  function handleBack() {
    if (location.key === 'default') navigate('/')
    else navigate(-1)
  }

  function handleAdd() {
    const result = addItem(product, quantity)
    if (result.ok) {
      showToast('Added to cart ✓')
      setQuantity(1)
    } else {
      showToast(result.message, 'error')
    }
  }

  return (
    <article>
      <button
        type="button"
        onClick={handleBack}
        className="mb-5 inline-flex min-h-11 items-center rounded-lg text-sm font-medium text-brand hover:underline focus-visible:outline-2 focus-visible:outline-brand"
      >
        ← Back to catalog
      </button>

      <div className="grid gap-8 md:grid-cols-2">
        <Gallery images={product.images} title={product.title} />

        <div>
          <h1 className="text-3xl leading-tight font-bold sm:text-4xl">{product.title}</h1>
          <p className="mt-2 text-sm text-muted">
            {product.brand && <span>{product.brand} · </span>}
            <Link
              to={`/?category=${encodeURIComponent(product.category)}`}
              className="font-medium text-brand hover:underline focus-visible:outline-2 focus-visible:outline-brand"
            >
              {formatCategory(product.category)}
            </Link>
          </p>

          <div className="mt-5">
            <PriceBlock price={product.price} discountPercentage={product.discountPercentage} size="lg" />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <StarRating value={product.rating} showValue />
            <StockBadge stock={product.stock} />
          </div>

          <p className="mt-6 max-w-prose leading-relaxed text-ink">{product.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <QuantityStepper
              value={quantity}
              max={Math.max(product.stock, 1)}
              label={product.title}
              onChange={setQuantity}
              disabled={outOfStock}
            />
            <Button size="lg" disabled={outOfStock} onClick={handleAdd}>
              {outOfStock ? 'Out of stock' : 'Add to cart'}
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
