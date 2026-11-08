import { productsEndpoints } from '../api/products.api'
import ProductGrid from '../components/product/ProductGrid'
import { ProductGridSkeleton } from '../components/product/Skeletons'
import EmptyState from '../components/ui/EmptyState'
import ErrorMessage from '../components/ui/ErrorMessage'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useFetch } from '../hooks/useFetch'
import type { Product } from '../types/product'
import { isProductsResponse } from '../utils/guards/product.guards'
import { DEFAULT_CATALOG_PARAMS } from '../utils/url'

export default function CatalogPage() {
  const { addItem } = useCart()
  const { showToast } = useToast()

  // First page of products (12). Search, filters and pagination come later.
  const { state, retry } = useFetch(
    productsEndpoints.list(DEFAULT_CATALOG_PARAMS),
    isProductsResponse,
  )

  function handleAdd(product: Product) {
    const result = addItem(product, 1)
    if (result.ok) showToast('Added to cart ✓')
    else showToast(result.message, 'error')
  }

  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold">Catalog</h1>

      {(state.status === 'idle' || state.status === 'loading') && <ProductGridSkeleton />}

      {state.status === 'error' && <ErrorMessage message={state.message} onRetry={retry} />}

      {state.status === 'success' && state.data.products.length === 0 && (
        <EmptyState title="No products found." description="Please check back a little later." />
      )}

      {state.status === 'success' && state.data.products.length > 0 && (
        <ProductGrid products={state.data.products} onAdd={handleAdd} />
      )}
    </div>
  )
}
