import { type ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { Icon, type IconName } from '../Icon'
import styles from './EmptyState.module.css'

export interface EmptyStateProps {
  icon?: IconName
  title: string
  description?: string
  /** Primary action rendered below the description. */
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon = 'tasks',
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cx(styles.root, className)}>
      <span className={styles.icon}>
        <Icon name={icon} size={28} aria-hidden="true" />
      </span>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}