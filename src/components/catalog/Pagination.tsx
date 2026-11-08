interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

type PageItem = number | 'ellipsis'

/** 1 ... 4 5 6 ... 17: always the first, the last and the neighbours of the current page. */
function getPageItems(page: number, totalPages: number): PageItem[] {
  const wanted = new Set([1, totalPages, page - 1, page, page + 1])
  const pages = [...wanted].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)

  const items: PageItem[] = []
  pages.forEach((current, index) => {
    const previous = pages[index - 1]
    if (previous !== undefined) {
      const gap = current - previous
      if (gap === 2) items.push(previous + 1) // a single hidden page is cheaper to show than "..."
      else if (gap > 2) items.push('ellipsis')
    }
    items.push(current)
  })
  return items
}

const buttonBase =
  'grid h-11 min-w-11 place-items-center rounded-lg border px-3 text-sm font-medium transition-colors ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ' +
  'disabled:cursor-not-allowed disabled:opacity-40'

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        className={`${buttonBase} border-line bg-surface enabled:hover:bg-sunken`}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        ‹
      </button>

      {getPageItems(page, totalPages).map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} aria-hidden="true" className="px-1 text-muted">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-label={`Page ${item}`}
            aria-current={item === page ? 'page' : undefined}
            className={`${buttonBase} tabular-nums ${
              item === page
                ? 'border-brand bg-brand text-on-brand'
                : 'border-line bg-surface hover:bg-sunken'
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className={`${buttonBase} border-line bg-surface enabled:hover:bg-sunken`}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  )
}
