import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../context/ToastContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { reviewsStorage } from '../../models/storage'
import type { Product, Review } from '../../types/product'
import { formatCategory } from '../../utils/format'
import type { ReviewsMap } from '../../utils/guards/review.guards'
import type { ReviewFormValues } from '../../utils/reviewValidation'
import { getDisplayName } from '../../utils/user'
import ReviewForm from '../reviews/ReviewForm'
import ReviewList from '../reviews/ReviewList'
import Button from '../ui/Button'
import QuantityStepper from '../ui/QuantityStepper'
import StarRating from '../ui/StarRating'
import Gallery from './Gallery'
import PriceBlock from './PriceBlock'
import RelatedProducts from './RelatedProducts'
import StockBadge from './StockBadge'

type Tab = 'description' | 'reviews'

const EMPTY_REVIEWS: ReviewsMap = {}

export default function ProductDetails({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { user, isLoggedIn } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState<Tab>('description')
  const [localReviews, setLocalReviews] = useLocalStorage(reviewsStorage, EMPTY_REVIEWS)

  const outOfStock = product.stock === 0

  // Newest local reviews first, then the ones that came with the API.
  const reviews = useMemo(
    () => [...(localReviews[String(product.id)] ?? []), ...product.reviews],
    [localReviews, product.id, product.reviews],
  )

  const averageRating = useMemo(
    () =>
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : product.rating,
    [reviews, product.rating],
  )

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

  function handleAddRelated(related: Product) {
    const result = addItem(related, 1)
    if (result.ok) showToast('Added to cart ✓')
    else showToast(result.message, 'error')
  }

  function handleReviewSubmit(values: ReviewFormValues) {
    const reviewerName = isLoggedIn ? getDisplayName(user) : 'Guest'
    const review: Review = {
      rating: values.rating,
      comment: values.comment.trim(),
      date: new Date().toISOString(),
      reviewerName,
    }
    const key = String(product.id)
    setLocalReviews((previous) => ({ ...previous, [key]: [review, ...(previous[key] ?? [])] }))
    showToast('Review added ✓')
  }

  const tabButton = (id: Tab, label: string) => (
    <button
      type="button"
      role="tab"
      id={`tab-${id}`}
      aria-selected={tab === id}
      aria-controls={`panel-${id}`}
      onClick={() => setTab(id)}
      className={`min-h-11 border-b-2 px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand ${
        tab === id ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-ink'
      }`}
    >
      {label}
    </button>
  )

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
            <StarRating value={averageRating} showValue />
            <span className="text-sm text-muted">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </span>
            <StockBadge stock={product.stock} />
          </div>

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

      <div className="mt-12">
        <div role="tablist" aria-label="Product information" className="flex border-b border-line">
          {tabButton('description', 'Description')}
          {tabButton('reviews', `Reviews (${reviews.length})`)}
        </div>

        <div
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          className="pt-6"
        >
          {tab === 'description' ? (
            <p className="max-w-prose leading-relaxed text-ink">{product.description}</p>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
              <ReviewList reviews={reviews} />
              <ReviewForm onSubmit={handleReviewSubmit} />
            </div>
          )}
        </div>
      </div>

      <RelatedProducts product={product} onAdd={handleAddRelated} />
    </article>
  )
}
