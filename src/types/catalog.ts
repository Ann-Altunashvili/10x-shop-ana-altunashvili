export type SortOption = '' | 'price-asc' | 'price-desc' | 'rating-desc' | 'title-asc'

/** Everything the catalog URL can say. Empty string / page 1 mean "not set". */
export interface CatalogParams {
  q: string
  category: string
  sort: SortOption
  page: number
}
