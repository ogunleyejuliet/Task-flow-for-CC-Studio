import { Badge, type BadgeVariant } from '../Badge'
import type { TaskStatus } from '../../types/task'

const config: Record<
  string,
  { label: string; variant: BadgeVariant; icon?: never }
> = {
  'to-do': { label: 'To Do', variant: 'neutral' },
  'todo': { label: 'To Do', variant: 'neutral' },
  'to_do': { label: 'To Do', variant: 'neutral' },
  'in-progress': { label: 'In Progress', variant: 'brand' },
  'in_progress': { label: 'In Progress', variant: 'brand' },
  'completed': { label: 'Completed', variant: 'success' },
  'complete': { label: 'Completed', variant: 'success' },
  'blocked': { label: 'Blocked', variant: 'error' },
}

export interface StatusBadgeProps {
  status: TaskStatus | string
  className?: string
}

/**
 * Task status pill. Always pairs color with text and a dot so meaning is
 * never communicated by color alone (DESIGN §17, §32).
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const item = config[status] ?? { label: status, variant: 'neutral' as BadgeVariant }
  return (
    <Badge variant={item.variant} dot className={className}>
      {item.label}
    </Badge>
  )
}