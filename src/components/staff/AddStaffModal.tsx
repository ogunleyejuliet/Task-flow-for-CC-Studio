import { useState, type FormEvent } from 'react'
import { Modal } from '../Modal/Modal'
import { Input } from '../Input/Input'
import { Select } from '../Select/Select'
import { Button } from '../Button/Button'
import { useToast } from '../../index'
import { addStaffMember } from '../../lib/supabase/staff'
import type { AccessLevel } from '../../lib/supabase/types'

export interface AddStaffModalProps {
  open: boolean
  onClose: () => void
  onStaffAdded: () => void
}

export function AddStaffModal({ open, onClose, onStaffAdded }: AddStaffModalProps) {
  const toast = useToast()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [role, setRole] = useState('')
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('staff')

  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const resetForm = () => {
    setFullName('')
    setEmail('')
    setDepartment('')
    setRole('')
    setAccessLevel('staff')
    setErrorMsg(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!fullName.trim() || !email.trim() || !department.trim() || !role.trim()) {
      setErrorMsg('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await addStaffMember({
        fullName: fullName.trim(),
        email: email.trim(),
        department: department.trim(),
        role: role.trim(),
        accessLevel,
      })

      if (error) {
        setErrorMsg(error.message)
        setSubmitting(false)
        return
      }

      toast.push({
        title: 'Staff Member Invited',
        description: `An invitation email has been sent to ${email.trim()}. Account status set to Pending.`,
        variant: 'success',
      })

      resetForm()
      onStaffAdded()
      onClose()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to add staff member.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add New Staff Member"
      description="Create a pending staff account and send an auth invitation email."
      size="md"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
          <Button variant="secondary" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={submitting}>
            Send Invitation
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

        <Input
          label="Full Name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. Amaka Okafor"
        />

        <Input
          label="Email Address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. amaka@catalyststudio.com"
        />

        <Input
          label="Department"
          required
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="e.g. Design, Engineering, Operations"
        />

        <Input
          label="Role (Descriptive)"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Product Manager, Senior Designer"
        />

        <Select
          label="Access Level (Authorization)"
          value={accessLevel}
          onChange={(e) => setAccessLevel(e.target.value as AccessLevel)}
          helperText="Managers can perform staff & client administration. Staff members are scoped to task work."
        >
          <option value="staff">Staff (Standard Task Access)</option>
          <option value="manager">Manager (Administrative Access)</option>
        </Select>
      </form>
    </Modal>
  )
}
