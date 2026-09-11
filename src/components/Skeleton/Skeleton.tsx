import type { HTMLAttributes } from 'react'
import { cx } from '../../utils/cx'
import styles from './Skeleton.module.css'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Width of the placeholder. Defaults to `100%`. */
  width?: number | string
  /** Height in px. Defaults to 16. */
  height?: number | string
  /** Renders a circular placeholder (e.g. for avatars). */
  circle?: boolean
  /** Rendered border radius. Defaults to the small radius. */
  radius?: number | string
}

export function Skeleton({
  width = '100%',
  height = 16,
  circle = false,
  radius,
  className,
  style,
  ...rest
}: SkeletonProps) {
  return (
    <div
      className={cx(styles.skeleton, circle && styles.circle, className)}
      style={{
        width,
        height,
        borderRadius: circle ? '50%' : radius,
        ...style,
      }}
      role="status"
      aria-label="Loading"
      {...rest}
    />
  )
}