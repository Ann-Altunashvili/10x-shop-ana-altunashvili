export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap ' +
  'transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-on-brand enabled:hover:bg-brand-hover',
  secondary: 'border border-line bg-surface text-ink enabled:hover:bg-sunken',
  ghost: 'text-ink enabled:hover:bg-sunken',
  danger: 'border border-danger/40 text-danger enabled:hover:bg-danger-soft',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

/** Class string shared by <Button> and by <Link> elements that should look like buttons. */
export function buttonStyles(variant: ButtonVariant = 'primary', size: ButtonSize = 'md'): string {
  return `${base} ${variants[variant]} ${sizes[size]}`
}
