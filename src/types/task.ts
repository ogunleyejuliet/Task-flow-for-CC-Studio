/**
 * Shared TaskFlow domain types used by product components.
 */

export type TaskStatus = 'to-do' | 'in-progress' | 'completed' | 'blocked'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface TaskData {
  id: string
  name: string
  project?: string
  assignee?: {
    name: string
    avatarUrl?: string | null
  }
  status: TaskStatus
  priority: TaskPriority
  /** ISO date string, e.g. `2026-09-14`. */
  dueDate?: string
  description?: string
}