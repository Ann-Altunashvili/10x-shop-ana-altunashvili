import { PAGE_SIZE } from '../api/config'
import type { CatalogParams, SortOption } from '../types/catalog'

export const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: '', label: 'Default' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating-desc', label: 'Rating: high to low' },
  { value: 'title-asc', label: 'Name A→Z' },
]

/** What the API calls each sort option. */
const SORT_QUERY: Record<Exclude<SortOption, ''>, { sortBy: string; order: 'asc' | 'desc' }> = {
  'price-asc': { sortBy: 'price', order: 'asc' },
  'price-desc': { sortBy: 'price', order: 'desc' },
  'rating-desc': { sortBy: 'rating', order: 'desc' },
  'title-asc': { sortBy: 'title', order: 'asc' },
}

export const DEFAULT_CATALOG_PARAMS: CatalogParams = { q: '', category: '', sort: '', page: 1 }

export function isSortOption(value: unknown): value is SortOption {
  return typeof value === 'string' && SORT_OPTIONS.some((option) => option.value === value)
}

/** The URL is the single source of truth: read it defensively, never trust it. */
export function parseCatalogParams(searchParams: URLSearchParams): CatalogParams {
  const q = (searchParams.get('q') ?? '').trim()
  // The API cannot search inside a category, so a search wins over a category.
  const category = q ? '' : (searchParams.get('category') ?? '').trim()
  const sort = searchParams.get('sort')
  const page = Number.parseInt(searchParams.get('page') ?? '', 10)

  return {
    q,
    category,
    sort: isSortOption(sort) ? sort : '',
    page: Number.isInteger(page) && page >= 1 ? page : 1,
  }
}

/** Only non-default values go into the URL, so "/" stays a clean address. */
export function toSearchParams(params: CatalogParams): URLSearchParams {
  const searchParams = new URLSearchParams()
  if (params.q) searchParams.set('q', params.q)
  if (params.category) searchParams.set('category', params.category)
  if (params.sort) searchParams.set('sort', params.sort)
  if (params.page > 1) searchParams.set('page', String(params.page))
  return searchParams
}

/** Apply a change and keep the filters consistent (see the rules below). */
export function nextCatalogParams(
  current: CatalogParams,
  patch: Partial<CatalogParams>,
): CatalogParams {
  const next: CatalogParams = { ...current, ...patch }
  // Search and category exclude each other.
  if (patch.q) next.category = ''
  else if (patch.category) next.q = ''
  // Any filter change goes back to page 1; only an explicit page change keeps its page.
  if (patch.page === undefined) next.page = 1
  return next
}

/** "/products?limit=12&skip=0&sortBy=price&order=asc" - the path only, no domain. */
export function buildProductsUrl(params: CatalogParams, limit = PAGE_SIZE): string {
  let path = '/products'
  if (params.q) path = '/products/search'
  else if (params.category) path = `/products/category/${encodeURIComponent(params.category)}`

  const query = new URLSearchParams()
  if (params.q) query.set('q', params.q)
  query.set('limit', String(limit))
  query.set('skip', String((params.page - 1) * limit))
  if (params.sort) {
    const { sortBy, order } = SORT_QUERY[params.sort]
    query.set('sortBy', sortBy)
    query.set('order', order)
  }
  return `${path}?${query.toString()}`
}
