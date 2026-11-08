import { useCallback, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PAGE_SIZE } from '../api/config'
import { productsEndpoints } from '../api/products.api'
import Pagination from '../components/catalog/Pagination'
import Toolbar from '../components/catalog/Toolbar'
import ProductGrid from '../components/product/ProductGrid'
import { ProductGridSkeleton } from '../components/product/Skeletons'
import { buttonStyles } from '../components/ui/buttonStyles'
import EmptyState from '../components/ui/EmptyState'
import ErrorMessage from '../components/ui/ErrorMessage'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useFetch } from '../hooks/useFetch'
import type { CatalogParams, SortOption } from '../types/catalog'
import type { Product } from '../types/product'
import { isCategoryList, isProductsResponse } from '../utils/guards/product.guards'
import { nextCatalogParams, parseCatalogParams, toSearchParams } from '../utils/url'

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { addItem } = useCart()
  const { showToast } = useToast()

  // The URL is the single source of truth for search, category, sort and page.
  const params = useMemo(() => parseCatalogParams(searchParams), [searchParams])
  const { state, retry } = useFetch(productsEndpoints.list(params), isProductsResponse)
  const { state: categoriesState } = useFetch(productsEndpoints.categories, isCategoryList)
  const categories = categoriesState.status === 'success' ? categoriesState.data : []

  const updateParams = useCallback(
    (patch: Partial<CatalogParams>, replace = false) => {
      setSearchParams((previous) => toSearchParams(nextCatalogParams(parseCatalogParams(previous), patch)), {
        replace,
      })
    },
    [setSearchParams],
  )

  // Typing in the search box replaces the history entry, so Back does not step through every keystroke.
  const handleSearch = useCallback((q: string) => updateParams({ q }, true), [updateParams])
  const handleCategory = useCallback((category: string) => updateParams({ category }), [updateParams])
  const handleSort = useCallback((sort: SortOption) => updateParams({ sort }), [updateParams])
  const handlePage = useCallback((page: number) => updateParams({ page }), [updateParams])

  // A new page of results starts at the top.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [params.page])

  const handleAdd = useCallback(
    (product: Product) => {
      const result = addItem(product, 1)
      if (result.ok) showToast('Added to cart ✓')
      else showToast(result.message, 'error')
    },
    [addItem, showToast],
  )

  const total = state.status === 'success' ? state.data.total : null

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <h1 className="text-4xl font-bold">Catalog</h1>
        {total !== null && (
          <p className="text-muted" aria-live="polite">
            {total} {total === 1 ? 'product' : 'products'}
          </p>
        )}
      </div>

      <div className="mb-6">
        <Toolbar
          params={params}
          categories={categories}
          onSearch={handleSearch}
          onCategoryChange={handleCategory}
          onSortChange={handleSort}
        />
      </div>

      {(state.status === 'idle' || state.status === 'loading') && <ProductGridSkeleton />}

      {state.status === 'error' && <ErrorMessage message={state.message} onRetry={retry} />}

      {state.status === 'success' && state.data.products.length === 0 && (
        <EmptyState title="No products found." description="Try a different search or category.">
          <Link to="/" className={buttonStyles('secondary')}>
            Clear filters
          </Link>
        </EmptyState>
      )}

      {state.status === 'success' && state.data.products.length > 0 && (
        <>
          <ProductGrid products={state.data.products} onAdd={handleAdd} />
          <div className="mt-8 space-y-3 text-center">
            <Pagination
              page={params.page}
              totalPages={Math.ceil(state.data.total / PAGE_SIZE)}
              onChange={handlePage}
            />
            <p className="text-sm text-muted">
              Showing {state.data.skip + 1}–{state.data.skip + state.data.products.length} of{' '}
              {state.data.total}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
