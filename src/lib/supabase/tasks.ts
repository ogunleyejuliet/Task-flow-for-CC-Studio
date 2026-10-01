import { supabase } from './client'
import type { TaskRow, TaskWithRelations } from './types'

export interface CreateTaskParams {
  title: string
  description?: string
  status: TaskRow['status']
  priority: TaskRow['priority']
  due_date?: string | null
  client_id?: string | null
  assignee_id?: string | null
  creator_id: string
}

export interface UpdateTaskParams {
  id: string
  title?: string
  description?: string | null
  status?: TaskRow['status']
  priority?: TaskRow['priority']
  due_date?: string | null
  client_id?: string | null
  assignee_id?: string | null
}

const TASK_SELECT = `
  id,
  title,
  description,
  status,
  priority,
  due_date,
  client_id,
  assignee_id,
  creator_id,
  created_at,
  updated_at,
  completed_at,
  assignee:assignee_id ( id, full_name, role ),
  creator:creator_id ( id, full_name ),
  client:client_id ( id, name )
`

/**
 * Helper to convert UI status strings to DB check-constraint values
 */
export function normalizeStatusToDb(status: string): string {
  const s = status.toLowerCase().trim()
  if (s === 'to-do' || s === 'to_do') return 'todo'
  if (s === 'in-progress') return 'in_progress'
  if (s === 'complete') return 'completed'
  return s
}

/**
 * Fetch all active tasks visible to the current user.
 * RLS enforces manager-sees-all vs. staff-sees-own.
 */
export async function fetchTasks(): Promise<{
  data: TaskWithRelations[] | null
  error: Error | null
}> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(TASK_SELECT)
      .order('created_at', { ascending: false })

    if (error) return { data: null, error: new Error(error.message) }
    return { data: data as unknown as TaskWithRelations[], error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) }
  }
}

/**
 * Fetch tasks assigned to a specific user (staff "My Tasks" view).
 * RLS still applies — staff can only see their own tasks.
 */
export async function fetchTasksForUser(userId: string): Promise<{
  data: TaskWithRelations[] | null
  error: Error | null
}> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(TASK_SELECT)
      .eq('assignee_id', userId)
      .order('due_date', { ascending: true, nullsFirst: false })

    if (error) return { data: null, error: new Error(error.message) }
    return { data: data as unknown as TaskWithRelations[], error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) }
  }
}

/**
 * Create a new task.
 */
export async function createTask(params: CreateTaskParams): Promise<{
  data: TaskWithRelations | null
  error: Error | null
}> {
  if (!params.title.trim()) {
    return { data: null, error: new Error('Task title is required.') }
  }

  try {
    const now = new Date().toISOString()
    const dbStatus = normalizeStatusToDb(params.status)

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: params.title.trim(),
        description: params.description?.trim() || null,
        status: dbStatus,
        priority: params.priority.toLowerCase(),
        due_date: params.due_date || null,
        client_id: params.client_id || null,
        assignee_id: params.assignee_id || null,
        creator_id: params.creator_id,
        created_at: now,
        updated_at: now,
      })
      .select(TASK_SELECT)
      .single()

    if (error) return { data: null, error: new Error(error.message) }
    return { data: data as unknown as TaskWithRelations, error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) }
  }
}

/**
 * Update an existing task.
 */
export async function updateTask(params: UpdateTaskParams): Promise<{
  data: TaskWithRelations | null
  error: Error | null
}> {
  if (params.title !== undefined && !params.title.trim()) {
    return { data: null, error: new Error('Task title cannot be empty.') }
  }

  try {
    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }
    if (params.title !== undefined) payload.title = params.title.trim()
    if (params.description !== undefined) payload.description = params.description?.trim() || null
    if (params.status !== undefined) {
      const dbStatus = normalizeStatusToDb(params.status)
      payload.status = dbStatus
      if (dbStatus === 'completed' || dbStatus === 'complete') {
        payload.completed_at = new Date().toISOString()
      }
    }
    if (params.priority !== undefined) payload.priority = params.priority.toLowerCase()
    if ('due_date' in params) payload.due_date = params.due_date || null
    if ('client_id' in params) payload.client_id = params.client_id || null
    if ('assignee_id' in params) payload.assignee_id = params.assignee_id || null

    const { data, error } = await supabase
      .from('tasks')
      .update(payload)
      .eq('id', params.id)
      .select(TASK_SELECT)
      .single()

    if (error) return { data: null, error: new Error(error.message) }
    return { data: data as unknown as TaskWithRelations, error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) }
  }
}

/**
 * Delete a task.
 * RLS ensures only authorized users can perform delete.
 */
export async function deleteTask(taskId: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) return { error: new Error(error.message) }
    return { error: null }
  } catch (err) {
    return { error: err instanceof Error ? err : new Error(String(err)) }
  }
}

/**
 * Update only the status of a task (quick status change).
 */
export async function updateTaskStatus(
  taskId: string,
  status: TaskRow['status']
): Promise<{ error: Error | null }> {
  try {
    const dbStatus = normalizeStatusToDb(status)
    const payload: Record<string, unknown> = {
      status: dbStatus,
      updated_at: new Date().toISOString(),
    }
    if (dbStatus === 'completed' || dbStatus === 'complete') {
      payload.completed_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('tasks')
      .update(payload)
      .eq('id', taskId)

    if (error) return { error: new Error(error.message) }
    return { error: null }
  } catch (err) {
    return { error: err instanceof Error ? err : new Error(String(err)) }
  }
}
