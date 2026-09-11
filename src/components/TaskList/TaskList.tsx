import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { TaskCard } from '../TaskCard'
import { EmptyState } from '../EmptyState'
import { Skeleton } from '../Skeleton'
import type { TaskData } from '../../types/task'
import styles from './TaskList.module.css'

export interface TaskListProps {
  tasks: TaskData[]
  onTaskClick?: (task: TaskData) => void
  /** Renders skeletons instead of the list while loading. */
  loading?: boolean
  /** Custom empty-state node. */
  emptyState?: ReactNode
  className?: string
}

export function TaskList({
  tasks,
  onTaskClick,
  loading = false,
  emptyState,
  className,
}: TaskListProps) {
  return (
    <div className={cx(styles.list, className)}>
      {loading ? (
        <>
          <div aria-hidden="true">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className={styles.skeletonRow}>
                <Skeleton width="100%" height={24} />
                <Skeleton width="55%" height={16} />
              </div>
            ))}
          </div>
          <span className={styles.srOnly} role="status">
            Loading tasks
          </span>
        </>
      ) : tasks.length === 0 ? (
        emptyState ?? (
          <EmptyState
            title="No tasks yet"
            description="Your tasks will appear here once they're assigned."
          />
        )
      ) : (
        tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        ))
      )}
    </div>
  )
}