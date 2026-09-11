import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import styles from './Card.module.css'

export type CardVariant = 'default' | 'powder' | 'elevated'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual treatment. Defaults to `default`. */
  variant?: CardVariant
  /** Removes padding for fully custom layouts. */
  padded?: boolean
  children?: ReactNode
}

const variantClasses: Record<CardVariant, string> = {
  default: styles.default,
  powder: styles.powder,
  elevated: styles.elevated,
}

export function Card({
  variant = 'default',
  padded = true,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cx(variantClasses[variant], padded && styles.padded, className)}
      {...rest}
    >
      {children}
    </div>
  )
}