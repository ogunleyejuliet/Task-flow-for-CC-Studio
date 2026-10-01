import { useState, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../Toast/useToast'
import {
  createTask,
  type CreateTaskParams,
} from '../../lib/supabase/tasks'
import type { TaskWithRelations, ClientRow, ProfileRow } from '../../lib/supabase/types'
import { Modal } from '../Modal/Modal'
import { Input } from '../Input/Input'
import { Select } from '../Select/Select'
import { Button } from '../Button/Button'
import styles from './CreateTaskModal.module.css'

export interface CreateTaskModalProps {
  open: boolean
  onClose: () => void
  onCreated: (task: TaskWithRelations) => void
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

const INITIAL: FormState = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  due_date: '',
  assignee_id: '',
  client_id: '',
}

export function CreateTaskModal({
  open,
  onClose,
  onCreated,
  staff,
  clients,
}: CreateTaskModalProps) {
  const { user, isManager } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitting, setSubmitting] = useState(false)

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = (): boolean => {
    const next: Partial<FormState> = {}
    if (!form.title.trim()) next.title = 'Title is required.'
    if (!form.status) next.status = 'Status is required.'
    if (!form.priority) next.priority = 'Priority is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleClose = useCallback(() => {
    setForm(INITIAL)
    setErrors({})
    setSubmitting(false)
    onClose()
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !user) return
    setSubmitting(true)

    const params: CreateTaskParams = {
      title: form.title,
      description: form.description || undefined,
      status: form.status,
      priority: form.priority,
      due_date: form.due_date || null,
      assignee_id: form.assignee_id || null,
      client_id: form.client_id || null,
      creator_id: user.id,
    }

    const { data, error } = await createTask(params)
    setSubmitting(false)

    if (error || !data) {
      toast.error('Could not create task', error?.message)
      return
    }

    toast.success('Task created', `"${data.title}" has been added.`)
    onCreated(data)
    handleClose()
  }

  // Staff can only assign to themselves (or leave unassigned)
  const assignableStaff = isManager
    ? staff.filter(s => s.account_status === 'active')
    : staff.filter(s => s.id === user?.id && s.account_status === 'active')

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create task"
      description="Add a new task to your workspace."
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
            form="create-task-form"
            loading={submitting}
          >
            Create task
          </Button>
        </div>
      }
    >
      <form id="create-task-form" onSubmit={handleSubmit} className={styles.form} noValidate>
        <Input
          label="Title"
          required
          placeholder="Enter task title..."
          value={form.title}
          onChange={set('title')}
          error={errors.title}
        />

        <div className={styles.fieldGroup}>
          <Select
            label="Status"
            required
            value={form.status}
            onChange={set('status')}
            error={errors.status}
          >
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
            error={errors.priority}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>
        </div>

        <div className={styles.fieldGroup}>
          <Select
            label="Assignee"
            value={form.assignee_id}
            onChange={set('assignee_id')}
          >
            <option value="">Unassigned</option>
            {assignableStaff.map(s => (
              <option key={s.id} value={s.id}>
                {s.full_name || s.email || s.id}
              </option>
            ))}
          </Select>

          <Select
            label="Client"
            value={form.client_id}
            onChange={set('client_id')}
          >
            <option value="">No client</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </div>

        <Input
          label="Due date"
          type="date"
          value={form.due_date}
          onChange={set('due_date')}
        />

        <div className={styles.textareaField}>
          <label className={styles.label} htmlFor="create-task-desc">
            Description <span className={styles.optional}>(optional)</span>
          </label>
          <textarea
            id="create-task-desc"
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
