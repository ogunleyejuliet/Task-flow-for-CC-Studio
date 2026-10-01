import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useToast } from '../../Toast/useToast'
import {
  fetchTasks,
  fetchTasksForUser,
  updateTaskStatus,
} from '../../../lib/supabase/tasks'
import { fetchStaffMembers } from '../../../lib/supabase/staff'
import { fetchClients } from '../../../lib/supabase/clients'
import type { TaskWithRelations, ProfileRow, ClientRow } from '../../../lib/supabase/types'
import type { TaskStatus, TaskPriority } from '../../../types/task'
import { Button } from '../../Button/Button'
import { Avatar } from '../../Avatar/Avatar'
import { StatusBadge } from '../../StatusBadge/StatusBadge'
import { PriorityBadge } from '../../PriorityBadge/PriorityBadge'
import { Icon } from '../../Icon/Icon'
import { EmptyState } from '../../EmptyState/EmptyState'
import { ErrorState } from '../../ErrorState/ErrorState'
import { Spinner } from '../../Spinner/Spinner'
import { Select } from '../../Select/Select'
import { CreateTaskModal } from './CreateTaskModal'
import { EditTaskModal } from './EditTaskModal'
import { DeleteTaskModal } from './DeleteTaskModal'
import styles from './TaskManagementView.module.css'

// Only show statuses that the existing StatusBadge can handle
const VALID_STATUSES: TaskStatus[] = ['to-do', 'in-progress', 'completed', 'blocked']
const VALID_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'urgent']

function isValidStatus(s: string): s is TaskStatus {
  return VALID_STATUSES.includes(s as TaskStatus)
}
function isValidPriority(p: string): p is TaskPriority {
  return VALID_PRIORITIES.includes(p as TaskPriority)
}

const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function fmtDate(iso: string | null) {
  if (!iso) return null
  const d = new Date(`${iso}T00:00:00`)
  if (isNaN(d.getTime())) return iso
  return `${MONTH[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

function isOverdue(iso: string | null, status: string) {
  if (!iso || status === 'completed') return false
  const d = new Date(`${iso}T00:00:00`)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return d < today
}

interface Filters {
  status: string
  priority: string
  assignee: string
  client: string
}

interface Props {
  /** 'all' shows all tasks (manager); 'my' shows only assigned tasks (staff) */
  scope: 'all' | 'my'
}

export function TaskManagementView({ scope }: Props) {
  const { user, isManager } = useAuth()
  const toast = useToast()

  const [tasks, setTasks] = useState<TaskWithRelations[]>([])
  const [staff, setStaff] = useState<ProfileRow[]>([])
  const [clients, setClients] = useState<ClientRow[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [filters, setFilters] = useState<Filters>({ status: '', priority: '', assignee: '', client: '' })
  const [createOpen, setCreateOpen] = useState(false)
  const [editTask, setEditTask] = useState<TaskWithRelations | null>(null)
  const [deleteTask, setDeleteTask] = useState<TaskWithRelations | null>(null)
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setFetchError(null)

    const [tasksResult, staffResult, clientsResult] = await Promise.all([
      scope === 'all' ? fetchTasks() : fetchTasksForUser(user!.id),
      fetchStaffMembers(),
      fetchClients(),
    ])

    setLoading(false)

    if (tasksResult.error) {
      setFetchError(tasksResult.error.message)
    } else {
      setTasks(tasksResult.data ?? [])
    }

    if (staffResult.data) setStaff(staffResult.data)
    if (clientsResult.data) setClients(clientsResult.data)
  }, [scope, user])

  useEffect(() => { load() }, [load])

  const handleStatusChange = async (task: TaskWithRelations, newStatus: string) => {
    setStatusUpdating(task.id)
    const { error } = await updateTaskStatus(task.id, newStatus)
    setStatusUpdating(null)

    if (error) {
      toast.error('Could not update status', error.message)
      return
    }
    setTasks(prev => prev.map(t =>
      t.id === task.id ? { ...t, status: newStatus, updated_at: new Date().toISOString() } : t
    ))
  }

  const handleCreated = (task: TaskWithRelations) => {
    setTasks(prev => [task, ...prev])
  }

  const handleUpdated = (task: TaskWithRelations) => {
    setTasks(prev => prev.map(t => t.id === task.id ? task : t))
  }

  const handleDeleted = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  const canEditTask = (task: TaskWithRelations) => {
    if (isManager) return true
    return task.assignee_id === user?.id || task.creator_id === user?.id
  }

  const canDeleteTask = (task: TaskWithRelations) => {
    if (isManager) return true
    return task.creator_id === user?.id || task.assignee_id === user?.id
  }

  // Filter tasks
  const filtered = tasks.filter(t => {
    if (filters.status && t.status !== filters.status) return false
    if (filters.priority && t.priority !== filters.priority) return false
    if (filters.assignee && t.assignee_id !== filters.assignee) return false
    if (filters.client && t.client_id !== filters.client) return false
    return true
  })

  const activeStaff = staff.filter(s => s.account_status === 'active')

  const setFilter = (key: keyof Filters) => (e: React.ChangeEvent<HTMLSelectElement>) =>
    setFilters(prev => ({ ...prev, [key]: e.target.value }))

  const hasFilters = Object.values(filters).some(Boolean)

  if (loading) {
    return (
      <div className={styles.center}>
        <Spinner size={28} />
        <span className={styles.loadingText}>Loading tasks…</span>
      </div>
    )
  }

  if (fetchError) {
    return (
      <ErrorState
        title="Couldn't load tasks"
        message={fetchError}
        onRetry={load}
      />
    )
  }

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.heading}>
            {scope === 'all' ? 'All Tasks' : 'My Tasks'}
          </h2>
          <span className={styles.count}>
            {filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>
        <Button
          variant="primary"
          size="sm"
          leadingIcon="plus"
          onClick={() => setCreateOpen(true)}
        >
          New task
        </Button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <Select
          value={filters.status}
          onChange={setFilter('status')}
          aria-label="Filter by status"
          className={styles.filterSelect}
        >
          <option value="">All statuses</option>
          <option value="to-do">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="blocked">Blocked</option>
        </Select>

        <Select
          value={filters.priority}
          onChange={setFilter('priority')}
          aria-label="Filter by priority"
          className={styles.filterSelect}
        >
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </Select>

        {isManager && (
          <Select
            value={filters.assignee}
            onChange={setFilter('assignee')}
            aria-label="Filter by assignee"
            className={styles.filterSelect}
          >
            <option value="">All assignees</option>
            {activeStaff.map(s => (
              <option key={s.id} value={s.id}>{s.full_name || s.email}</option>
            ))}
          </Select>
        )}

        <Select
          value={filters.client}
          onChange={setFilter('client')}
          aria-label="Filter by client"
          className={styles.filterSelect}
        >
          <option value="">All clients</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>

        {hasFilters && (
          <button
            type="button"
            className={styles.clearFilters}
            onClick={() => setFilters({ status: '', priority: '', assignee: '', client: '' })}
          >
            <Icon name="close" size={14} aria-hidden="true" />
            Clear
          </button>
        )}
      </div>

      {/* Task table */}
      {filtered.length === 0 ? (
        tasks.length === 0 ? (
          <EmptyState
            icon="tasks"
            title="No tasks yet"
            description={scope === 'my'
              ? "Tasks assigned to you will appear here."
              : "Create your first task to get started."
            }
            action={
              <Button variant="primary" size="sm" leadingIcon="plus" onClick={() => setCreateOpen(true)}>
                New task
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon="search"
            title="No matching tasks"
            description="Try adjusting or clearing your filters."
            action={
              <button type="button" className={styles.clearFilters} onClick={() => setFilters({ status: '', priority: '', assignee: '', client: '' })}>
                Clear filters
              </button>
            }
          />
        )
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Task</th>
                <th className={styles.th}>Assignee</th>
                <th className={styles.th}>Client</th>
                <th className={styles.th}>Due</th>
                <th className={styles.th}>Priority</th>
                <th className={styles.th}>Status</th>
                <th className={styles.thActions}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(task => {
                const overdue = isOverdue(task.due_date, task.status)
                const status = isValidStatus(task.status) ? task.status : 'to-do'
                const priority = isValidPriority(task.priority) ? task.priority : 'medium'

                return (
                  <tr key={task.id} className={styles.row}>
                    <td className={styles.td}>
                      <div className={styles.titleCell}>
                        <span className={styles.taskTitle}>{task.title}</span>
                        {task.description && (
                          <span className={styles.taskDesc}>{task.description}</span>
                        )}
                      </div>
                    </td>

                    <td className={styles.td}>
                      {task.assignee ? (
                        <span className={styles.assigneeCell}>
                          <Avatar name={task.assignee.full_name ?? '?'} size="xs" />
                          <span className={styles.assigneeName}>{task.assignee.full_name}</span>
                        </span>
                      ) : (
                        <span className={styles.unassigned}>Unassigned</span>
                      )}
                    </td>

                    <td className={styles.td}>
                      {task.client ? (
                        <span className={styles.clientName}>{task.client.name}</span>
                      ) : (
                        <span className={styles.unassigned}>—</span>
                      )}
                    </td>

                    <td className={styles.td}>
                      {task.due_date ? (
                        <span className={overdue ? styles.overdue : styles.dueDate}>
                          <Icon
                            name={overdue ? 'alert-circle' : 'clock'}
                            size={13}
                            aria-hidden="true"
                          />
                          {fmtDate(task.due_date)}
                        </span>
                      ) : (
                        <span className={styles.unassigned}>—</span>
                      )}
                    </td>

                    <td className={styles.td}>
                      <PriorityBadge priority={priority} />
                    </td>

                    <td className={styles.td}>
                      {statusUpdating === task.id ? (
                        <Spinner size={16} />
                      ) : (
                        <div className={styles.statusCell}>
                          <StatusBadge status={status} />
                          {canEditTask(task) && (
                            <select
                              className={styles.statusSelect}
                              value={task.status}
                              onChange={e => handleStatusChange(task, e.target.value)}
                              aria-label={`Change status of ${task.title}`}
                            >
                              <option value="to-do">To Do</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="blocked">Blocked</option>
                            </select>
                          )}
                        </div>
                      )}
                    </td>

                    <td className={styles.tdActions}>
                      <div className={styles.actions}>
                        {canEditTask(task) && (
                          <button
                            type="button"
                            className={styles.actionBtn}
                            onClick={() => setEditTask(task)}
                            aria-label={`Edit ${task.title}`}
                          >
                            <Icon name="edit" size={15} aria-hidden="true" />
                          </button>
                        )}
                        {canDeleteTask(task) && (
                          <button
                            type="button"
                            className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                            onClick={() => setDeleteTask(task)}
                            aria-label={`Delete ${task.title}`}
                          >
                            <Icon name="trash" size={15} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <CreateTaskModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
        staff={staff}
        clients={clients}
      />

      <EditTaskModal
        open={editTask !== null}
        task={editTask}
        onClose={() => setEditTask(null)}
        onUpdated={handleUpdated}
        staff={staff}
        clients={clients}
      />

      <DeleteTaskModal
        open={deleteTask !== null}
        task={deleteTask}
        onClose={() => setDeleteTask(null)}
        onDeleted={handleDeleted}
      />
    </div>
  )
}
