import type { CSSProperties } from 'react'
import { cx } from '../../utils/cx'
import styles from './Spinner.module.css'

export interface SpinnerProps {
  /** Rendered px size. Defaults to 18. */
  size?: number
  className?: string
  style?: CSSProperties
}

/**
 * Accessible loading indicator. Purely decorative via `aria-hidden`; the
 * surrounding control communicates loading status to assistive technology.
 */
export function Spinner({ size = 18, className, style }: SpinnerProps) {
  return (
    <svg
      className={cx(styles.spinner, className)}
      style={{ width: size, height: size, ...style }}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        className={styles.track}
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="4"
      />
      <path
        className={styles.head}
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}