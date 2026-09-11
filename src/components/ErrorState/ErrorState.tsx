import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { Icon } from '../Icon'
import styles from './ErrorState.module.css'

export interface ErrorStateProps {
  title?: string
  message?: string
  /** Callback for the "Try again" primary action. */
  onRetry?: () => void
  action?: ReactNode
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  message = "We couldn't load your content.",
  onRetry,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div className={cx(styles.root, className)} role="alert">
      <span className={styles.icon}>
        <Icon name="alert-circle" size={28} aria-hidden="true" />
      </span>
      <h3 className={styles.title}>{title}</h3>
      {message && <p className={styles.message}>{message}</p>}
      {(action || onRetry) && (
        <div className={styles.action}>
          {action ?? (
            <button type="button" className={styles.retry} onClick={onRetry}>
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  )
}