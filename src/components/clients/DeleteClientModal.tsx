import { useState, useEffect } from 'react'
import { Modal } from '../Modal/Modal'
import { Button } from '../Button/Button'
import { Spinner } from '../Spinner/Spinner'
import { useToast } from '../../index'
import { deleteClient, getTaskCountForClient } from '../../lib/supabase/clients'
import type { ClientRow } from '../../lib/supabase/types'

export interface DeleteClientModalProps {
  open: boolean
  onClose: () => void
  targetClient: ClientRow | null
  onClientDeleted: () => void
}

export function DeleteClientModal({
  open,
  onClose,
  targetClient,
  onClientDeleted,
}: DeleteClientModalProps) {
  const toast = useToast()

  const [taskCount, setTaskCount] = useState<number | null>(null)
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (open && targetClient?.id) {
      setLoadingTasks(true)
      setErrorMsg(null)
      getTaskCountForClient(targetClient.id)
        .then((count) => setTaskCount(count))
        .finally(() => setLoadingTasks(false))
    }
  }, [open, targetClient])

  if (!targetClient) return null

  const hasAssociatedTasks = taskCount !== null && taskCount > 0

  const handleDelete = async () => {
    if (hasAssociatedTasks) return

    setErrorMsg(null)
    setSubmitting(true)

    try {
      const { error } = await deleteClient(targetClient.id)

      if (error) {
        setErrorMsg(error.message)
        setSubmitting(false)
        return
      }

      toast.push({
        title: 'Client Deleted',
        description: `Client "${targetClient.name}" was successfully deleted.`,
        variant: 'success',
      })

      onClientDeleted()
      onClose()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to delete client.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Delete Client "${targetClient.name}"`}
      description="Deleting a client removes it from the agency client directory."
      size="md"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            loading={submitting}
            disabled={loadingTasks || hasAssociatedTasks}
          >
            Delete Client
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {errorMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#FEE2E2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              fontSize: '0.875rem',
            }}
            role="alert"
          >
            {errorMsg}
          </div>
        )}

        <div
          style={{
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: hasAssociatedTasks ? '#FEF2F2' : '#F8FAFC',
            border: `1px solid ${hasAssociatedTasks ? '#FCA5A5' : '#E5E7EB'}`,
          }}
        >
          <p style={{ margin: 0, fontWeight: 500, fontSize: '0.9375rem' }}>
            Associated Tasks Status:
          </p>
          {loadingTasks ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Spinner size={16} />
              <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Checking linked tasks...</span>
            </div>
          ) : hasAssociatedTasks ? (
            <div style={{ marginTop: '0.5rem', color: '#991B1B', fontSize: '0.875rem', lineHeight: 1.5 }}>
              ⚠️ <strong>Deletion Blocked:</strong> There are <strong>{taskCount} task(s)</strong> currently linked to "{targetClient.name}". You cannot delete a client with active or historical tasks attached. Please reassign or remove those tasks first.
            </div>
          ) : (
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#4B5563' }}>
              No tasks are currently associated with this client. It is safe to proceed with deletion.
            </p>
          )}
        </div>
      </div>
    </Modal>
  )
}
