import { useState } from 'react'
import { useToast } from '../Toast/useToast'
import { deleteTask } from '../../lib/supabase/tasks'
import type { TaskWithRelations } from '../../lib/supabase/types'
import { Modal } from '../Modal/Modal'
import { Button } from '../Button/Button'
import styles from './DeleteTaskModal.module.css'

export interface DeleteTaskModalProps {
  open: boolean
  task: TaskWithRelations | null
  onClose: () => void
  onDeleted: (taskId: string) => void
}

export function DeleteTaskModal({ open, task, onClose, onDeleted }: DeleteTaskModalProps) {
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!task) return
    setLoading(true)
    const { error } = await deleteTask(task.id)
    setLoading(false)

    if (error) {
      toast.error('Could not delete task', error.message)
      return
    }

    toast.success('Task deleted', `"${task.title}" has been removed.`)
    onDeleted(task.id)
    onClose()
  }

  if (!task) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete task?"
      description="This action cannot be undone."
      size="sm"
      footer={
        <div className={styles.footer}>
          <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" size="md" onClick={handleDelete} loading={loading}>
            Delete task
          </Button>
        </div>
      }
    >
      <div className={styles.body}>
        <p className={styles.message}>
          Are you sure you want to delete{' '}
          <strong className={styles.taskName}>&ldquo;{task.title}&rdquo;</strong>?
          {' '}This task will be removed from all views.
        </p>
      </div>
    </Modal>
  )
}
