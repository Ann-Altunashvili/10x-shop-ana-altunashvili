import { useEffect, useRef, useState } from 'react'
import { useDebounce } from '../../hooks/useDebounce'
import type { CatalogParams, SortOption } from '../../types/catalog'
import type { Category } from '../../types/product'
import { fieldStyles } from '../ui/fieldStyles'
import { isSortOption, SORT_OPTIONS } from '../../utils/url'

interface ToolbarProps {
  params: CatalogParams
  categories: Category[]
  onSearch: (q: string) => void
  onCategoryChange: (slug: string) => void
  onSortChange: (sort: SortOption) => void
}

/** Search (debounced), category and sort. Every change is reported upward: the URL owns the state. */
export default function Toolbar({
  params,
  categories,
  onSearch,
  onCategoryChange,
  onSortChange,
}: ToolbarProps) {
  // The input has its own state so typing never lags; the URL is updated 400 ms after the last keystroke.
  const [text, setText] = useState(params.q)
  const debouncedText = useDebounce(text.trim(), 400)
  // The last value that came from (or went to) the URL - lets us tell "my own update" from "Back button".
  const lastSynced = useRef(params.q)

  // typing -> URL. Only when the debounced value has caught up with the input: right after the URL
  // cleared the input (see below) the debounced value is still the old text and must not be pushed back.
  useEffect(() => {
    if (debouncedText === text.trim() && debouncedText !== lastSynced.current) {
      lastSynced.current = debouncedText
      onSearch(debouncedText)
    }
  }, [debouncedText, text, onSearch])

  // URL -> input (Back/Forward, "Clear filters", choosing a category clears the search)
  useEffect(() => {
    if (params.q !== lastSynced.current) {
      lastSynced.current = params.q
      setText(params.q)
    }
  }, [params.q])

  return (
    <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]" role="search">
      <div>
        <label htmlFor="catalog-search" className="sr-only">
          Search products
        </label>
        <input
          id="catalog-search"
          type="search"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Search products…"
          autoComplete="off"
          className={`h-11 ${fieldStyles(false)}`}
        />
      </div>

      <div>
        <label htmlFor="catalog-category" className="sr-only">
          Category
        </label>
        <select
          id="catalog-category"
          value={params.category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className={`h-11 md:min-w-48 ${fieldStyles(false)}`}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="catalog-sort" className="sr-only">
          Sort by
        </label>
        <select
          id="catalog-sort"
          value={params.sort}
          onChange={(event) => {
            const value = event.target.value
            if (isSortOption(value)) onSortChange(value)
          }}
          className={`h-11 md:min-w-48 ${fieldStyles(false)}`}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
