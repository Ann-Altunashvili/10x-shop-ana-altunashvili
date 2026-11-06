export default function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-20 text-muted">
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-line border-t-brand"
      />
      <span>{label}</span>
    </div>
  )
}
