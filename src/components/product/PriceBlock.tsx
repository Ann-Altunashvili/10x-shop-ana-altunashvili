import { discountedPrice, formatPrice } from '../../utils/format'
import Badge from '../ui/Badge'

interface PriceBlockProps {
  price: number
  discountPercentage: number
  size?: 'md' | 'lg'
}

/** Discounted price big, the old price struck through, and a green badge when the discount is >= 1%. */
export default function PriceBlock({ price, discountPercentage, size = 'md' }: PriceBlockProps) {
  const hasDiscount = discountPercentage >= 1
  const current = discountedPrice(price, discountPercentage)

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span
        className={`font-display font-bold tabular-nums ${size === 'lg' ? 'text-3xl' : 'text-xl'}`}
      >
        {formatPrice(current)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-sm text-muted tabular-nums line-through">
            <span className="sr-only">Original price </span>
            {formatPrice(price)}
          </span>
          <Badge tone="success">−{Math.round(discountPercentage)}%</Badge>
        </>
      )}
    </div>
  )
}
