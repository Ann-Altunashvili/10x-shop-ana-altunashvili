import type { CatalogParams } from '../types/catalog'
import { buildProductsUrl } from '../utils/url'

/** The DummyJSON addresses the app uses, in one place. */
export const productsEndpoints = {
  list: (params: CatalogParams): string => buildProductsUrl(params),
  details: (id: number): string => `/products/${id}`,
  categories: '/products/categories',
  byCategory: (slug: string, limit: number): string =>
    `/products/category/${encodeURIComponent(slug)}?limit=${limit}`,
} as const
