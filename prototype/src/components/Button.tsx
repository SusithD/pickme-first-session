import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { LinkProps } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

function classes(variant: ButtonVariant, block: boolean | undefined, extra?: string): string {
  return ['btn', `btn-${variant}`, block ? 'btn-block' : '', extra ?? ''].filter(Boolean).join(' ')
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  block?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  block,
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={classes(variant, block, className)} {...rest}>
      {children}
    </button>
  )
}

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant
  block?: boolean
}

export function LinkButton({
  variant = 'primary',
  block,
  className,
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <Link className={classes(variant, block, className)} {...rest}>
      {children}
    </Link>
  )
}
