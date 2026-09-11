import { cx } from '../../utils/cx'
import { Card } from '../Card'
import { Avatar } from '../Avatar'
import { StatusBadge } from '../StatusBadge'
import { PriorityBadge } from '../PriorityBadge'
import { Icon } from '../Icon'
import type { TaskData } from '../../types/task'
import styles from './TaskCard.module.css'

export type { TaskData } from '../../types/task'

export interface TaskCardProps {
  task: TaskData
  /** Makes the card interactive (clickable + keyboard operable). */
  onClick?: (task: TaskData) => void
  className?: string
}

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

function formatDueDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return `${monthNames[date.getMonth()]} ${date.getDate()}`
}

function isOverdue(iso: string): boolean {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

export function TaskCard({ task, onClick, className }: TaskCardProps) {
  const interactive = typeof onClick === 'function'
  const overdue = task.dueDate
    ? isOverdue(task.dueDate) && task.status !== 'completed'
    : false

  const content = (
    <>
      <div className={styles.top}>
        <h4 className={styles.title}>{task.name}</h4>
        {task.project && <span className={styles.project}>{task.project}</span>}
      </div>
      <div className={styles.bottom}>
        <div className={styles.meta}>
          {task.assignee ? (
            <span className={styles.assignee}>
              <Avatar name={task.assignee.name} src={task.assignee.avatarUrl} size="sm" />
              <span className={styles.assigneeName}>{task.assignee.name}</span>
            </span>
          ) : (
            <span className={styles.unassigned}>Unassigned</span>
          )}
          {task.dueDate && (
            <span
              className={cx(styles.dueDate, overdue && styles.overdue)}
            >
              <Icon
                name={overdue ? 'alert-circle' : 'clock'}
                size={14}
                aria-hidden="true"
              />
              {overdue ? 'Overdue ' : 'Due '}
              {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>
        <div className={styles.badges}>
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </div>
      </div>
    </>
  )

  if (interactive) {
    return (
      <Card
        variant="default"
        padded
        className={cx(styles.card, interactive && styles.interactive, className)}
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.currentTarget.focus()
          onClick(task)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick(task)
          }
        }}
      >
        {content}
      </Card>
    )
  }

  return (
    <Card variant="default" padded className={cx(styles.card, className)}>
      {content}
    </Card>
  )
}