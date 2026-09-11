import { cx } from '../../utils/cx'
import type { CSSProperties } from 'react'
import logoUrl from '../../assets/branding/taskflow-logo.svg'
import styles from './TaskflowLogo.module.css'

export interface TaskflowLogoProps {
  /** Alt text. Defaults to "TaskFlow". */
  alt?: string
  /**
   * Optional rendered width in px. The logo keeps its intrinsic proportions.
   * When using the centered symbol (collapsed rails) prefer `size`.
   */
  width?: number
  /**
   * Optional symbol-only crop (the TaskFlow star mark) used in small
   * contexts such as collapsed navigation. The crop preserves the intrinsic
   * geometry of the official asset; it never stretches or recolors it.
   */
  symbolOnly?: boolean
  /**
   * Symbol size in px when `symbolOnly` is set.
   */
  size?: number
  className?: string
  style?: CSSProperties
}

/**
 * The official TaskFlow logo. This component always renders the supplied
 * brand asset (`assets/branding/taskflow-logo.svg`) and must not be replaced
 * with text, icon-library glyphs or CSS shapes (see DESIGN.md §3).
 */
export function TaskflowLogo({
  alt = 'TaskFlow',
  width = 160,
  symbolOnly = false,
  size = 28,
  className,
  style,
}: TaskflowLogoProps) {
  if (symbolOnly) {
    return (
      <span
        className={cx(styles.symbol, className)}
        style={{ width: Math.round(size * 1.05), height: size, ...style }}
        role="img"
        aria-label={alt}
      >
        <img src={logoUrl} alt="" className={styles.image} draggable={false} />
      </span>
    )
  }
  return (
    <img
      src={logoUrl}
      alt={alt}
      width={width}
      className={cx(styles.logo, className)}
      style={style}
      draggable={false}
    />
  )
}