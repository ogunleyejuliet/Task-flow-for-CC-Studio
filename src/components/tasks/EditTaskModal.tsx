import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../Toast/useToast'
import { updateTask, type UpdateTaskParams } from '../../lib/supabase/tasks'
import type { TaskWithRelations, ClientRow, ProfileRow } from '../../lib/supabase/types'
import { Modal } from '../Modal/Modal'
import { Input } from '../Input/Input'
import { Select } from '../Select/Select'
import { Button } from '../Button/Button'
import styles from './CreateTaskModal.module.css'

export interface EditTaskModalProps {
  open: boolean
  task: TaskWithRelations | null
  onClose: () => void
  onUpdated: (task: TaskWithRelations) => void
  staff: ProfileRow[]
  clients: ClientRow[]
}

interface FormState {
  title: string
  description: string
  status: string
  priority: string
  due_date: string
  assignee_id: string
  client_id: string
}

function taskToForm(task: TaskWithRelations): FormState {
  return {
    title: task.title,
    description: task.description ?? '',
    status: task.status,
    priority: task.priority,
    due_date: task.due_date ?? '',
    assignee_id: task.assignee_id ?? '',
    client_id: task.client_id ?? '',
  }
}

export function EditTaskModal({
  open,
  task,
  onClose,
  onUpdated,
  staff,
  clients,
}: EditTaskModalProps) {
  const { isManager, user } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState<FormState>(() => task ? taskToForm(task) : {
    title: '', description: '', status: 'todo', priority: 'medium',
    due_date: '', assignee_id: '', client_id: '',
  })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (task) setForm(taskToForm(task))
  }, [task])

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }))
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

  const validate = () => {
    const next: Partial<FormState> = {}
    if (!form.title.trim()) next.title = 'Title is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleClose = useCallback(() => {
    setErrors({})
    setSubmitting(false)
    onClose()
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !task) return
    setSubmitting(true)

    // Determine which fields this user can update
    const params: UpdateTaskParams = { id: task.id, title: form.title }

    // Staff can only update: title, status, description (of their own tasks)
    // Managers can update all fields
    if (isManager) {
      params.description = form.description || null
      params.status = form.status
      params.priority = form.priority
      params.due_date = form.due_date || null
      params.assignee_id = form.assignee_id || null
      params.client_id = form.client_id || null
    } else {
      // Staff: can update title, description, status on tasks they own
      const canEdit =
        task.assignee_id === user?.id || task.creator_id === user?.id
      if (!canEdit) {
        toast.error('Permission denied', 'You cannot edit this task.')
        setSubmitting(false)
        return
      }
      params.description = form.description || null
      params.status = form.status
    }

    const { data, error } = await updateTask(params)
    setSubmitting(false)

    if (error || !data) {
      toast.error('Could not update task', error?.message)
      return
    }

    toast.success('Task updated', `"${data.title}" has been saved.`)
    onUpdated(data)
    handleClose()
  }

  const activeStaff = staff.filter(s => s.account_status === 'active')

  if (!task) return null

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Edit task"
      size="md"
      footer={
        <div className={styles.footer}>
          <Button variant="secondary" size="md" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            type="submit"
            form="edit-task-form"
            loading={submitting}
          >
            Save changes
          </Button>
        </div>
      }
    >
      <form id="edit-task-form" onSubmit={handleSubmit} className={styles.form} noValidate>
        <Input
          label="Title"
          required
          placeholder="Task title..."
          value={form.title}
          onChange={set('title')}
          error={errors.title}
        />

        <div className={styles.fieldGroup}>
          <Select label="Status" required value={form.status} onChange={set('status')}>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </Select>

          <Select
            label="Priority"
            required
            value={form.priority}
            onChange={set('priority')}
            disabled={!isManager}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>
        </div>

        {isManager && (
          <div className={styles.fieldGroup}>
            <Select label="Assignee" value={form.assignee_id} onChange={set('assignee_id')}>
              <option value="">Unassigned</option>
              {activeStaff.map(s => (
                <option key={s.id} value={s.id}>
                  {s.full_name || s.email || s.id}
                </option>
              ))}
            </Select>

            <Select label="Client" value={form.client_id} onChange={set('client_id')}>
              <option value="">No client</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
        )}

        {isManager && (
          <Input
            label="Due date"
            type="date"
            value={form.due_date}
            onChange={set('due_date')}
          />
        )}

        <div className={styles.textareaField}>
          <label className={styles.label} htmlFor="edit-task-desc">
            Description <span className={styles.optional}>(optional)</span>
          </label>
          <textarea
            id="edit-task-desc"
            className={styles.textarea}
            placeholder="Add context or details..."
            value={form.description}
            onChange={set('description')}
            rows={3}
          />
        </div>
      </form>
    </Modal>
  )
}
