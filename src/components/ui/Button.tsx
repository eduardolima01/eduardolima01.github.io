import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center rounded-md font-medium cursor-pointer ' +
  'transition disabled:cursor-not-allowed disabled:opacity-50 ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white border border-accent hover:brightness-110',
  secondary: 'bg-panel text-ink border border-line hover:border-accent',
  danger:
    'bg-transparent text-danger border border-danger hover:bg-danger hover:text-white',
  ghost: 'bg-transparent text-muted underline hover:text-ink border-none px-0',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
}

export default function Button({
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const classes = [base, variants[variant], sizes[size], className]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
