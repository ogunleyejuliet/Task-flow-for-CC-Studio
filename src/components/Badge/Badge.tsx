import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { Icon, type IconName } from '../Icon'
import styles from './Badge.module.css'

export type BadgeVariant =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

export type BadgeSize = 'sm' | 'md'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  /** Renders a small status dot before the content. */
  dot?: boolean
  /** Icon rendered before the content. */
  icon?: IconName
  children?: ReactNode
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: styles.neutral,
  brand: styles.brand,
  success: styles.success,
  warning: styles.warning,
  error: styles.error,
  info: styles.info,
}

export function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  icon,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cx(styles.badge, variantClasses[variant], styles[size], className)}
      {...rest}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {icon && <Icon name={icon} size={12} aria-hidden="true" />}
      <span className={styles.text}>{children}</span>
    </span>
  )
}