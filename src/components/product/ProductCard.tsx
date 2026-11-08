import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import { formatCategory } from '../../utils/format'
import Button from '../ui/Button'
import StarRating from '../ui/StarRating'
import PriceBlock from './PriceBlock'
import StockBadge from './StockBadge'

interface ProductCardProps {
  product: Product
  onAdd: (product: Product) => void
}

function ProductCard({ product, onAdd }: ProductCardProps) {
  const outOfStock = product.stock === 0
  const meta = product.brand ? `${formatCategory(product.category)} · ${product.brand}` : formatCategory(product.category)

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-shadow focus-within:shadow-lg hover:shadow-lg">
      <div className="aspect-square bg-sunken">
        <img
          src={product.thumbnail}
          alt={product.title}
          width={320}
          height={320}
          loading="lazy"
          className="size-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs text-muted">{meta}</p>
        <h3 className="text-base leading-snug font-semibold">
          {/* The ::after layer stretches this link over the whole card, so the entire card is clickable. */}
          <Link
            to={`/products/${product.id}`}
            className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {product.title}
          </Link>
        </h3>
        <div className="flex items-center justify-between gap-2">
          <StarRating value={product.rating} showValue />
          <StockBadge stock={product.stock} />
        </div>
        <div className="mt-auto pt-2">
          <PriceBlock price={product.price} discountPercentage={product.discountPercentage} />
        </div>
        {/* relative z-10 lifts the button above the stretched link */}
        <Button
          className="relative z-10 mt-2 w-full"
          disabled={outOfStock}
          onClick={() => onAdd(product)}
          aria-label={outOfStock ? `${product.title} is out of stock` : `Add ${product.title} to cart`}
        >
          {outOfStock ? 'Out of stock' : 'Add to cart'}
        </Button>
      </div>
    </article>
  )
}

export default memo(ProductCard)