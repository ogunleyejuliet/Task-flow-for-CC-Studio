import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { Icon, type IconName } from '../Icon'
import { Spinner } from '../Spinner'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual treatment. Defaults to `primary`. */
  variant?: ButtonVariant
  /** Control height. Defaults to `md` (40px). */
  size?: ButtonSize
  /** Shows a spinner and prevents interaction. */
  loading?: boolean
  /** Expands the button to fill its container. */
  fullWidth?: boolean
  /** Icon rendered at the start of the label. */
  leadingIcon?: IconName
  /** Icon rendered at the end of the label. */
  trailingIcon?: IconName
  /**
   * Render a circular/square icon-only button. When enabled and no `children`
   * are provided, `aria-label` should be supplied.
   */
  iconOnly?: boolean
  children?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  tertiary: styles.tertiary,
  destructive: styles.destructive,
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  iconOnly = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      className={cx(
        styles.base,
        variantClasses[variant],
        sizeClasses[size],
        iconOnly && styles.iconOnly,
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className,
      )}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <Spinner size={16} className={styles.spinner} />
      ) : leadingIcon ? (
        <Icon name={leadingIcon} size={iconSizeFor(size)} aria-hidden="true" />
      ) : null}
      {children != null && <span className={styles.label}>{children}</span>}
      {!loading && trailingIcon && (
        <Icon name={trailingIcon} size={iconSizeFor(size)} aria-hidden="true" />
      )}
    </button>
  )
}

function iconSizeFor(size: ButtonSize): number {
  return size === 'lg' ? 18 : size === 'sm' ? 14 : 16
}