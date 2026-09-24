import { useState, useEffect } from 'react'
import { Modal } from '../Modal/Modal'
import { Select } from '../Select/Select'
import { Button } from '../Button/Button'
import { Spinner } from '../Spinner/Spinner'
import { useToast } from '../../index'
import { disableStaffMember, getOpenTaskCountForUser } from '../../lib/supabase/staff'
import type { ProfileRow } from '../../lib/supabase/types'

export interface DisableStaffModalProps {
  open: boolean
  onClose: () => void
  targetStaff: ProfileRow | null
  activeStaffList: ProfileRow[]
  onStaffDisabled: () => void
}

export function DisableStaffModal({
  open,
  onClose,
  targetStaff,
  activeStaffList,
  onStaffDisabled,
}: DisableStaffModalProps) {
  const toast = useToast()

  const [openTaskCount, setOpenTaskCount] = useState<number | null>(null)
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [reassignToUserId, setReassignToUserId] = useState<string>('')

  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (open && targetStaff?.id) {
      setLoadingTasks(true)
      setReassignToUserId('')
      setErrorMsg(null)
      getOpenTaskCountForUser(targetStaff.id)
        .then((count) => setOpenTaskCount(count))
        .finally(() => setLoadingTasks(false))
    }
  }, [open, targetStaff])

  if (!targetStaff) return null

  // Filter staff list to offer valid reassign targets (active staff excluding target)
  const availableAssignees = activeStaffList.filter(
    (s) => s.id !== targetStaff.id && (s.account_status?.toLowerCase() === 'active' || !s.account_status)
  )

  const handleDisable = async () => {
    setErrorMsg(null)
    setSubmitting(true)

    try {
      const { error } = await disableStaffMember({
        userId: targetStaff.id,
        reassignToUserId: reassignToUserId || undefined,
      })

      if (error) {
        setErrorMsg(error.message)
        setSubmitting(false)
        return
      }

      toast.push({
        title: 'Account Disabled',
        description: `${targetStaff.full_name || targetStaff.email} has been disabled.${
          reassignToUserId ? ' Open tasks have been reassigned.' : ''
        }`,
        variant: 'success',
      })

      onStaffDisabled()
      onClose()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to disable staff account.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Disable ${targetStaff.full_name || targetStaff.email}`}
      description="Disabling an account blocks the user from logging into TaskFlow."
      size="md"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDisable} loading={submitting}>
            Confirm Disable
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
            backgroundColor: '#F8FAFC',
            border: '1px solid #E5E7EB',
          }}
        >
          <p style={{ margin: 0, fontWeight: 500, fontSize: '0.9375rem' }}>
            Open Task Summary:
          </p>
          {loadingTasks ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Spinner size={16} />
              <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Checking assigned tasks...</span>
            </div>
          ) : (
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#4B5563' }}>
              {targetStaff.full_name || 'This user'} currently has{' '}
              <strong style={{ color: openTaskCount && openTaskCount > 0 ? '#DC2626' : '#111827' }}>
                {openTaskCount ?? 0} open task(s)
              </strong>.
            </p>
          )}
        </div>

        {openTaskCount !== null && openTaskCount > 0 && (
          <div>
            <Select
              label="Optionally Reassign Open Tasks"
              value={reassignToUserId}
              onChange={(e) => setReassignToUserId(e.target.value)}
              helperText="Select a team member to take ownership of open tasks, or leave unselected."
            >
              <option value="">Do not reassign (Keep original assignee)</option>
              {availableAssignees.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.full_name || member.email} ({member.role || 'Staff'})
                </option>
              ))}
            </Select>
          </div>
        )}
      </div>
    </Modal>
  )
}
