/** Shared look of inputs, selects and textareas; the border turns red when the field has an error. */
export function fieldStyles(hasError: boolean): string {
  return (
    'w-full rounded-lg border bg-surface px-3 text-base text-ink placeholder:text-muted ' +
    'transition-colors hover:border-muted focus:border-brand focus:outline-2 focus:outline-offset-0 ' +
    'focus:outline-brand/30 disabled:cursor-not-allowed disabled:opacity-60 ' +
    (hasError ? 'border-danger' : 'border-line')
  )
}
