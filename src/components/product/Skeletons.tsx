/** Grey placeholders with the same layout as the real content: the page does not jump when data arrives. */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface" aria-hidden="true">
      <div className="aspect-square animate-pulse bg-sunken" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/2 animate-pulse rounded bg-sunken" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-sunken" />
        <div className="h-6 w-1/3 animate-pulse rounded bg-sunken" />
        <div className="h-11 animate-pulse rounded-lg bg-sunken" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading products…</span>
      <ul className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 desktop:grid-cols-4">
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ProductDetailsSkeleton() {
  return (
    <div role="status" aria-busy="true" className="grid gap-8 md:grid-cols-2">
      <span className="sr-only">Loading product…</span>
      <div className="aspect-square animate-pulse rounded-2xl bg-sunken" />
      <div className="space-y-4">
        <div className="h-8 w-3/4 animate-pulse rounded bg-sunken" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-sunken" />
        <div className="h-10 w-1/3 animate-pulse rounded bg-sunken" />
        <div className="h-24 animate-pulse rounded bg-sunken" />
        <div className="h-11 w-2/3 animate-pulse rounded-lg bg-sunken" />
      </div>
    </div>
  )
}
