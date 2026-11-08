import { useParams } from 'react-router-dom'
import { productsEndpoints } from '../api/products.api'
import ProductDetails from '../components/product/ProductDetails'
import { ProductDetailsSkeleton } from '../components/product/Skeletons'
import ErrorMessage from '../components/ui/ErrorMessage'
import { useFetch } from '../hooks/useFetch'
import { isProduct } from '../utils/guards/product.guards'
import NotFoundPage from './NotFoundPage'

/** "5" -> 5, but "abc", "-1", "1.5" and undefined -> null (no request is sent for those). */
function parseProductId(value: string | undefined): number | null {
  if (value === undefined || !/^\d+$/.test(value)) return null
  const id = Number(value)
  return id > 0 ? id : null
}

export default function ProductPage() {
  const { id } = useParams()
  const productId = parseProductId(id)

  // `path` is the effect dependency inside useFetch: a new id means a new request.
  const { state, retry } = useFetch(
    productId === null ? null : productsEndpoints.details(productId),
    isProduct,
  )

  if (productId === null) return <NotFoundPage />
  if (state.status === 'error' && state.code === 404) return <NotFoundPage />
  if (state.status === 'error') return <ErrorMessage message={state.message} onRetry={retry} />
  if (state.status !== 'success') return <ProductDetailsSkeleton />

  // key = product id: moving from one product to a related one starts with a clean local state.
  return <ProductDetails key={state.data.id} product={state.data} />
}
