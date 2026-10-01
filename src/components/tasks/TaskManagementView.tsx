import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../Toast/useToast'
import {
  fetchTasks,
  fetchTasksForUser,
  updateTaskStatus,
} from '../../lib/supabase/tasks'
import { fetchStaffMembers } from '../../lib/supabase/staff'
import { fetchClients } from '../../lib/supabase/clients'
import type { TaskWithRelations, ProfileRow, ClientRow } from '../../lib/supabase/types'
import type { TaskStatus, TaskPriority } from '../../types/task'
import { Button } from '../Button/Button'
import { Avatar } from '../Avatar/Avatar'
import { StatusBadge } from '../StatusBadge/StatusBadge'
import { PriorityBadge } from '../PriorityBadge/PriorityBadge'
import { Icon } from '../Icon/Icon'
import { EmptyState } from '../EmptyState/EmptyState'
import { ErrorState } from '../ErrorState/ErrorState'
import { Spinner } from '../Spinner/Spinner'
import { Select } from '../Select/Select'
import { Input } from '../Input/Input'
import { CreateTaskModal } from './CreateTaskModal'
import { EditTaskModal } from './EditTaskModal'
import { DeleteTaskModal } from './DeleteTaskModal'
import { formatDateLabel, isTaskDueToday, isTaskOverdue } from '../../utils/date'
import styles from './TaskManagementView.module.css'

const VALID_STATUSES: TaskStatus[] = ['to-do', 'in-progress', 'completed', 'blocked']
const VALID_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'urgent']

function isValidStatus(s: string): s is TaskStatus {
  return VALID_STATUSES.includes(s as TaskStatus)
}
function isValidPriority(p: string): p is TaskPriority {
  return VALID_PRIORITIES.includes(p as TaskPriority)
}

export type DashboardTab = 'all' | 'today' | 'in-progress' | 'completed' | 'overdue'

interface Filters {
  status: string
  priority: string
  assignee: string
  client: string
  dueDateFilter: string
}

export interface TaskManagementViewProps {
  /** 'all' shows all tasks (manager); 'my' shows only assigned tasks (staff) */
  scope: 'all' | 'my'
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export function TaskManagementView({
  scope,
  searchQuery = '',
  onSearchChange,
}: TaskManagementViewProps) {
  const { user, isManager } = useAuth()
  const toast = useToast()

  const [tasks, setTasks] = useState<TaskWithRelations[]>([])
  const [staff, setStaff] = useState<ProfileRow[]>([])
  const [clients, setClients] = useState<ClientRow[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<DashboardTab>('all')
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [filters, setFilters] = useState<Filters>({
    status: '',
    priority: '',
    assignee: '',
    client: '',
    dueDateFilter: '',
  })

  const [createOpen, setCreateOpen] = useState(false)
  const [editTask, setEditTask] = useState<TaskWithRelations | null>(null)
  const [deleteTask, setDeleteTask] = useState<TaskWithRelations | null>(null)
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null)

  const effectiveSearch = searchQuery !== undefined ? searchQuery : localSearch

  const handleSearchChange = (val: string) => {
    setLocalSearch(val)
    if (onSearchChange) {
      onSearchChange(val)
    }
  }

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

  useEffect(() => {
    load()
  }, [load])

  const handleStatusChange = async (task: TaskWithRelations, newStatus: string) => {
    setStatusUpdating(task.id)
    const { error } = await updateTaskStatus(task.id, newStatus)
    setStatusUpdating(null)

    if (error) {
      toast.error('Could not update status', error.message)
      return
    }
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              status: newStatus,
              updated_at: new Date().toISOString(),
              completed_at: newStatus === 'completed' ? new Date().toISOString() : t.completed_at,
            }
          : t,
      ),
    )
  }

  const handleCreated = (task: TaskWithRelations) => {
    setTasks((prev) => [task, ...prev])
  }

  const handleUpdated = (task: TaskWithRelations) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
  }

  const handleDeleted = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  const canEditTask = (task: TaskWithRelations) => {
    if (isManager) return true
    return task.assignee_id === user?.id || task.creator_id === user?.id
  }

  const canDeleteTask = (task: TaskWithRelations) => {
    if (isManager) return true
    return task.creator_id === user?.id || task.assignee_id === user?.id
  }

  function matchesStatus(taskStatus: string, target: 'completed' | 'in-progress' | string): boolean {
    const s = taskStatus.toLowerCase().trim()
    if (target === 'completed') return s === 'completed' || s === 'complete'
    if (target === 'in-progress') return s === 'in-progress' || s === 'in_progress'
    if (target === 'to-do' || target === 'todo') return s === 'to-do' || s === 'todo' || s === 'to_do'
    return s === target.toLowerCase().trim()
  }

  // Dashboard Counts derived from exact authorized active task data
  const todayCount = tasks.filter((t) => isTaskDueToday(t.due_date) && !matchesStatus(t.status, 'completed')).length
  const inProgressCount = tasks.filter((t) => matchesStatus(t.status, 'in-progress')).length
  const completedCount = tasks.filter((t) => matchesStatus(t.status, 'completed')).length
  const overdueCount = tasks.filter((t) => isTaskOverdue(t.due_date, t.status)).length
  const totalCount = tasks.length

  // Filter tasks based on active Tab, Dropdown Filters, and Search Query
  const filtered = tasks.filter((t) => {
    // 1. Tab View Filter
    if (activeTab === 'today') {
      if (!isTaskDueToday(t.due_date) || matchesStatus(t.status, 'completed')) return false
    } else if (activeTab === 'in-progress') {
      if (!matchesStatus(t.status, 'in-progress')) return false
    } else if (activeTab === 'completed') {
      if (!matchesStatus(t.status, 'completed')) return false
    } else if (activeTab === 'overdue') {
      if (!isTaskOverdue(t.due_date, t.status)) return false
    }

    // 2. Dropdown Filters
    if (filters.status && !matchesStatus(t.status, filters.status)) return false
    if (filters.priority && t.priority.toLowerCase() !== filters.priority.toLowerCase()) return false
    if (filters.assignee && t.assignee_id !== filters.assignee) return false
    if (filters.client && t.client_id !== filters.client) return false
    if (filters.dueDateFilter === 'today' && !isTaskDueToday(t.due_date)) return false
    if (filters.dueDateFilter === 'overdue' && !isTaskOverdue(t.due_date, t.status)) return false

    // 3. Search Query (Title, Description, Client Name, Assignee Name)
    if (effectiveSearch.trim()) {
      const q = effectiveSearch.trim().toLowerCase()
      const titleMatch = t.title.toLowerCase().includes(q)
      const descMatch = (t.description || '').toLowerCase().includes(q)
      const clientMatch = (t.client?.name || '').toLowerCase().includes(q)
      const assigneeMatch = (t.assignee?.full_name || '').toLowerCase().includes(q)
      if (!titleMatch && !descMatch && !clientMatch && !assigneeMatch) return false
    }

    return true
  })

  const activeStaff = staff.filter((s) => s.account_status === 'active')

  const setFilter = (key: keyof Filters) => (e: React.ChangeEvent<HTMLSelectElement>) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }))

  const clearAllFilters = () => {
    setFilters({
      status: '',
      priority: '',
      assignee: '',
      client: '',
      dueDateFilter: '',
    })
    handleSearchChange('')
  }

  const hasFilters = Object.values(filters).some(Boolean) || Boolean(effectiveSearch.trim())

  if (loading) {
    return (
      <div className={styles.center}>
        <Spinner size={28} />
        <span className={styles.loadingText}>Loading tasks…</span>
      </div>
    )
  }

  if (fetchError) {
    return <ErrorState title="Couldn't load tasks" message={fetchError} onRetry={load} />
  }

  return (
    <div className={styles.root}>
      {/* KPI Metric Summary Cards */}
      <div className={styles.kpiGrid}>
        <div
          className={`${styles.kpiCard} ${activeTab === 'today' ? styles.kpiCardActive : ''}`}
          onClick={() => setActiveTab('today')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('today')}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiTitle}>Today</span>
            <span className={`${styles.kpiIcon} ${styles.kpiIconToday}`}>
              <Icon name="clock" size={18} />
            </span>
          </div>
          <div className={styles.kpiValue}>{todayCount}</div>
          <div className={styles.kpiSub}>Due today</div>
        </div>

        <div
          className={`${styles.kpiCard} ${activeTab === 'in-progress' ? styles.kpiCardActive : ''}`}
          onClick={() => setActiveTab('in-progress')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('in-progress')}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiTitle}>In Progress</span>
            <span className={`${styles.kpiIcon} ${styles.kpiIconInProgress}`}>
              <Icon name="tasks" size={18} />
            </span>
          </div>
          <div className={styles.kpiValue}>{inProgressCount}</div>
          <div className={styles.kpiSub}>Active work</div>
        </div>

        <div
          className={`${styles.kpiCard} ${activeTab === 'completed' ? styles.kpiCardActive : ''}`}
          onClick={() => setActiveTab('completed')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('completed')}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiTitle}>Completed</span>
            <span className={`${styles.kpiIcon} ${styles.kpiIconCompleted}`}>
              <Icon name="check" size={18} />
            </span>
          </div>
          <div className={styles.kpiValue}>{completedCount}</div>
          <div className={styles.kpiSub}>Finished tasks</div>
        </div>

        <div
          className={`${styles.kpiCard} ${activeTab === 'overdue' ? styles.kpiCardActive : ''}`}
          onClick={() => setActiveTab('overdue')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('overdue')}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiTitle}>Overdue</span>
            <span className={`${styles.kpiIcon} ${styles.kpiIconOverdue}`}>
              <Icon name="alert-circle" size={18} />
            </span>
          </div>
          <div className={styles.kpiValue}>{overdueCount}</div>
          <div className={styles.kpiSub}>Attention required</div>
        </div>
      </div>

      {/* Header & Actions */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.heading}>{scope === 'all' ? 'All Workspace Tasks' : 'My Assigned Tasks'}</h2>
          <span className={styles.count}>
            {filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>
        <Button variant="primary" size="sm" leadingIcon="plus" onClick={() => setCreateOpen(true)}>
          New task
        </Button>
      </div>

      {/* Tabs Navigation Bar */}
      <div className={styles.tabBar} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'all'}
          className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Tasks
          <span className={`${styles.tabBadge} ${activeTab === 'all' ? styles.tabBadgeActive : ''}`}>
            {totalCount}
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'today'}
          className={`${styles.tabBtn} ${activeTab === 'today' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('today')}
        >
          Today
          <span className={`${styles.tabBadge} ${activeTab === 'today' ? styles.tabBadgeActive : ''}`}>
            {todayCount}
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'in-progress'}
          className={`${styles.tabBtn} ${activeTab === 'in-progress' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('in-progress')}
        >
          In Progress
          <span className={`${styles.tabBadge} ${activeTab === 'in-progress' ? styles.tabBadgeActive : ''}`}>
            {inProgressCount}
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'completed'}
          className={`${styles.tabBtn} ${activeTab === 'completed' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
          <span className={`${styles.tabBadge} ${activeTab === 'completed' ? styles.tabBadgeActive : ''}`}>
            {completedCount}
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'overdue'}
          className={`${styles.tabBtn} ${activeTab === 'overdue' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('overdue')}
        >
          Overdue
          <span className={`${styles.tabBadge} ${activeTab === 'overdue' ? styles.tabBadgeActive : ''}`}>
            {overdueCount}
          </span>
        </button>
      </div>

      {/* Filter Controls */}
      <div className={styles.filters}>
        <Input
          aria-label="Filter tasks by text"
          leadingIcon="search"
          placeholder="Filter by title, client, assignee..."
          value={effectiveSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={styles.searchInput}
        />

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
            {activeStaff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name || s.email}
              </option>
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
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        <Select
          value={filters.dueDateFilter}
          onChange={setFilter('dueDateFilter')}
          aria-label="Filter by due date"
          className={styles.filterSelect}
        >
          <option value="">All due dates</option>
          <option value="today">Due Today</option>
          <option value="overdue">Overdue</option>
        </Select>

        {hasFilters && (
          <button type="button" className={styles.clearFilters} onClick={clearAllFilters}>
            <Icon name="close" size={14} aria-hidden="true" />
            Clear
          </button>
        )}
      </div>

      {/* Task table & Empty States */}
      {filtered.length === 0 ? (
        tasks.length === 0 ? (
          <EmptyState
            icon="tasks"
            title="No tasks yet"
            description={
              scope === 'my' ? 'Tasks assigned to you will appear here.' : 'Create your first task to get started.'
            }
            action={
              <Button variant="primary" size="sm" leadingIcon="plus" onClick={() => setCreateOpen(true)}>
                New task
              </Button>
            }
          />
        ) : activeTab === 'today' ? (
          <EmptyState
            icon="clock"
            title="No tasks due today"
            description="You have no tasks scheduled for today."
            action={
              <Button variant="secondary" size="sm" onClick={() => setActiveTab('all')}>
                View all tasks
              </Button>
            }
          />
        ) : activeTab === 'in-progress' ? (
          <EmptyState
            icon="tasks"
            title="No tasks in progress"
            description="There are currently no tasks in progress."
            action={
              <Button variant="secondary" size="sm" onClick={() => setActiveTab('all')}>
                View all tasks
              </Button>
            }
          />
        ) : activeTab === 'completed' ? (
          <EmptyState
            icon="check"
            title="No completed tasks"
            description="No tasks have been marked as completed yet."
            action={
              <Button variant="secondary" size="sm" onClick={() => setActiveTab('all')}>
                View all tasks
              </Button>
            }
          />
        ) : activeTab === 'overdue' ? (
          <EmptyState
            icon="check-circle"
            title="No overdue tasks"
            description="Great work! There are no overdue tasks."
            action={
              <Button variant="secondary" size="sm" onClick={() => setActiveTab('all')}>
                View all tasks
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon="search"
            title="No matching tasks"
            description="No tasks match your search query or filter selection."
            action={
              <Button variant="secondary" size="sm" onClick={clearAllFilters}>
                Clear filters
              </Button>
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
              {filtered.map((task) => {
                const overdue = isTaskOverdue(task.due_date, task.status)
                const status = isValidStatus(task.status) ? task.status : 'to-do'
                const priority = isValidPriority(task.priority) ? task.priority : 'medium'

                return (
                  <tr key={task.id} className={styles.row}>
                    <td className={styles.td}>
                      <div className={styles.titleCell}>
                        <span className={styles.taskTitle}>{task.title}</span>
                        {task.description && <span className={styles.taskDesc}>{task.description}</span>}
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
                          <Icon name={overdue ? 'alert-circle' : 'clock'} size={13} aria-hidden="true" />
                          {formatDateLabel(task.due_date)}
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
                              onChange={(e) => handleStatusChange(task, e.target.value)}
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
