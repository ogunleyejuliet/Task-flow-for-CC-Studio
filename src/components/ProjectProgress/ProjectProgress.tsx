import { cx } from '../../utils/cx'
import styles from './ProjectProgress.module.css'

export type ProgressTone = 'brand' | 'success' | 'warning'

export interface ProjectProgressProps {
  /** Completion percentage. Clamped to 0–100. */
  value: number
  /** Accessible name for the progress bar. */
  label?: string
  /** Show the label row with the percentage. */
  showLabel?: boolean
  tone?: ProgressTone
  className?: string
}

const toneClasses: Record<ProgressTone, string> = {
  brand: styles.brand,
  success: styles.success,
  warning: styles.warning,
}

export function ProjectProgress({
  value,
  label,
  showLabel = true,
  tone = 'brand',
  className,
}: ProjectProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={cx(styles.root, className)}>
      {showLabel && (
        <div className={styles.labelRow}>
          <span className={styles.label}>{label}</span>
          <span className={styles.percent}>{Math.round(clamped)}%</span>
        </div>
      )}
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
      >
        <div
          className={cx(styles.fill, toneClasses[tone])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}