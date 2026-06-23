import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'

import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

type Variant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'

type Size =
  | 'sm'
  | 'md'
  | 'lg'

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: Variant
  size?: Size
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  asChild?: boolean
}

const variants: Record<Variant, string> = {
  primary: `
    bg-accent
    text-white
    hover:opacity-90
  `,

  secondary: `
    border
    border-line
    bg-panel
    text-ink
    hover:bg-bg
  `,

  outline: `
    border
    border-line
    bg-transparent
    text-ink
    hover:bg-panel
  `,

  ghost: `
    bg-transparent
    text-ink
    hover:bg-panel
  `,

  danger: `
    bg-danger
    text-white
    hover:opacity-90
  `,
}

const sizes: Record<Size, string> = {
  sm: `
    h-9
    px-3
    text-sm
  `,

  md: `
    h-11
    px-5
    text-sm
  `,

  lg: `
    h-12
    px-6
    text-base
  `,
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Component = asChild
      ? Slot
      : 'button'

    const classes = `
      inline-flex
      items-center
      justify-center
      gap-2

      rounded-xl

      font-medium

      transition-all
      duration-200

      disabled:cursor-not-allowed
      disabled:opacity-50

      cursor-pointer

      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `

    if (asChild) {
      return (
        <Slot
          className={classes}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={classes}
        {...props}
      >
        {loading ? (
          <>
            <span
              className="
                h-4
                w-4
                animate-spin
                rounded-full
                border-2
                border-current
                border-t-transparent
              "
            />

            Carregando...
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
