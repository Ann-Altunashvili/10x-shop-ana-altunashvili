import { useMemo } from 'react'
import { productsEndpoints } from '../../api/products.api'
import { useFetch } from '../../hooks/useFetch'
import type { Product } from '../../types/product'
import { isProductsResponse } from '../../utils/guards/product.guards'
import ProductGrid from './ProductGrid'

interface RelatedProductsProps {
  product: Product
  onAdd: (product: Product) => void
}

/** Same category, without the current product, at most four - rendered with the very same ProductCard. */
export default function RelatedProducts({ product, onAdd }: RelatedProductsProps) {
  // limit=5: one extra, because the current product is probably in the answer and gets removed.
  const { state } = useFetch(productsEndpoints.byCategory(product.category, 5), isProductsResponse)

  const related = useMemo(
    () =>
      state.status === 'success'
        ? state.data.products.filter((item) => item.id !== product.id).slice(0, 4)
        : [],
    [state, product.id],
  )

  // Related products are a bonus: if they fail to load, the page is still complete without them.
  if (related.length === 0) return null

  return (
    <section aria-labelledby="related-heading" className="mt-14">
      <h2 id="related-heading" className="mb-5 text-2xl font-bold">
        Related products
      </h2>
      <ProductGrid products={related} onAdd={onAdd} />
    </section>
  )
}
