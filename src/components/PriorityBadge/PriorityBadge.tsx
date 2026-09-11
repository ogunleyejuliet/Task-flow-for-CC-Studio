import { Badge, type BadgeVariant } from '../Badge'
import type { TaskPriority } from '../../types/task'

const config: Record<TaskPriority, { label: string; variant: BadgeVariant }> = {
  low: { label: 'Low', variant: 'neutral' },
  medium: { label: 'Medium', variant: 'brand' },
  high: { label: 'High', variant: 'warning' },
  urgent: { label: 'Urgent', variant: 'error' },
}

export interface PriorityBadgeProps {
  priority: TaskPriority
  className?: string
}

/**
 * Priority pill. Uses a distinct visual treatment (flag icon) plus color and
 * text so it is never confused with status and never relies on color alone
 * (DESIGN §18).
 */
export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const { label, variant } = config[priority]
  return (
    <Badge variant={variant} icon="flag" className={className}>
      {label}
    </Badge>
  )
}