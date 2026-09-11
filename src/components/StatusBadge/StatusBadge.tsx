import { Badge, type BadgeVariant } from '../Badge'
import type { TaskStatus } from '../../types/task'

const config: Record<
  TaskStatus,
  { label: string; variant: BadgeVariant; icon?: never }
> = {
  'to-do': { label: 'To Do', variant: 'neutral' },
  'in-progress': { label: 'In Progress', variant: 'brand' },
  completed: { label: 'Completed', variant: 'success' },
  blocked: { label: 'Blocked', variant: 'error' },
}

export interface StatusBadgeProps {
  status: TaskStatus
  className?: string
}

/**
 * Task status pill. Always pairs color with text and a dot so meaning is
 * never communicated by color alone (DESIGN §17, §32).
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, variant } = config[status]
  return (
    <Badge variant={variant} dot className={className}>
      {label}
    </Badge>
  )
}