import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Card } from '../Card/Card'
import { Button } from '../Button/Button'
import { Badge } from '../Badge/Badge'
import { Avatar } from '../Avatar/Avatar'
import { Tabs, type TabItem } from '../Tabs/Tabs'
import { Spinner } from '../Spinner/Spinner'
import { EmptyState } from '../EmptyState/EmptyState'
import { ErrorState } from '../ErrorState/ErrorState'
import { useToast } from '../../index'
import { AddStaffModal } from './AddStaffModal'
import { DisableStaffModal } from './DisableStaffModal'
import { fetchStaffMembers, resendStaffInvite, reactivateStaffMember } from '../../lib/supabase/staff'
import type { ProfileRow, AccountStatus } from '../../lib/supabase/types'

export function StaffManagementView() {
  const { user: currentUser } = useAuth()
  const toast = useToast()

  const [staffList, setStaffList] = useState<ProfileRow[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [addModalOpen, setAddModalOpen] = useState(false)

  const [disableTarget, setDisableTarget] = useState<ProfileRow | null>(null)
  const [disableModalOpen, setDisableModalOpen] = useState(false)
  const [resendingEmail, setResendingEmail] = useState<string | null>(null)
  const [reactivatingId, setReactivatingId] = useState<string | null>(null)

  const loadStaff = useCallback(async () => {
    setLoading(true)
    setErrorMsg(null)
    const { data, error } = await fetchStaffMembers()
    if (error) {
      setErrorMsg(error.message)
    } else {
      setStaffList(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadStaff()
  }, [loadStaff])

  // Count active managers to enforce last-manager safeguard
  const activeManagerCount = staffList.filter(
    (s) =>
      s.access_level?.toLowerCase() === 'manager' &&
      (s.account_status?.toLowerCase() === 'active' || !s.account_status)
  ).length

  const handleResendInvite = async (staff: ProfileRow) => {
    if (!staff.email) return
    setResendingEmail(staff.email)
    try {
      const { error } = await resendStaffInvite(staff.email)
      if (error) {
        toast.push({
          title: 'Resend Failed',
          description: error.message,
          variant: 'error',
        })
      } else {
        toast.push({
          title: 'Invitation Resent',
          description: `A new invitation link has been dispatched to ${staff.email}.`,
          variant: 'success',
        })
        await loadStaff()
      }
    } finally {
      setResendingEmail(null)
    }
  }

  const handleReactivate = async (staff: ProfileRow) => {
    setReactivatingId(staff.id)
    try {
      const { error } = await reactivateStaffMember(staff.id)
      if (error) {
        toast.push({
          title: 'Reactivation Failed',
          description: error.message,
          variant: 'error',
        })
      } else {
        toast.push({
          title: 'Account Reactivated',
          description: `${staff.full_name || staff.email} has been reactivated.`,
          variant: 'success',
        })
        await loadStaff()
      }
    } finally {
      setReactivatingId(null)
    }
  }

  const openDisableModal = (staff: ProfileRow) => {
    setDisableTarget(staff)
    setDisableModalOpen(true)
  }

  const renderStaffTable = (filterStatus: 'all' | 'active' | 'pending' | 'disabled') => {
    const filtered = staffList.filter((s) => {
      const status: AccountStatus = (s.account_status?.toLowerCase() as AccountStatus) || 'active'
      if (filterStatus === 'all') return true
      return status === filterStatus
    })

    if (filtered.length === 0) {
      return (
        <EmptyState
          title="No Staff Members Found"
          description={
            filterStatus === 'all'
              ? 'No staff members exist in the system yet. Click "Add Staff Member" to send an invitation.'
              : `There are currently no staff members with status "${filterStatus}".`
          }
          action={
            filterStatus === 'all' ? (
              <Button variant="primary" onClick={() => setAddModalOpen(true)}>
                Add Staff Member
              </Button>
            ) : undefined
          }
        />
      )
    }

    return (
      <Card padded variant="elevated" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Staff Member</th>
              <th style={{ padding: '0.75rem 1rem' }}>Department</th>
              <th style={{ padding: '0.75rem 1rem' }}>Role</th>
              <th style={{ padding: '0.75rem 1rem' }}>Access Level</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((staff) => {
              const name = staff.full_name || 'Staff Member'
              const isSelf = staff.id === currentUser?.id
              const isManager = staff.access_level?.toLowerCase() === 'manager'
              const status: AccountStatus = (staff.account_status?.toLowerCase() as AccountStatus) || 'active'

              const isDisableDisabled =
                isSelf || (isManager && activeManagerCount <= 1)

              let disableTooltip = ''
              if (isSelf) disableTooltip = 'You cannot disable your own manager account.'
              else if (isManager && activeManagerCount <= 1)
                disableTooltip = 'Cannot disable the last active manager account.'

              return (
                <tr key={staff.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Avatar name={name} size="sm" />
                      <div>
                        <div style={{ fontWeight: 600, color: '#111827' }}>
                          {name} {isSelf && <span style={{ color: '#2F6DB5', fontSize: '0.75rem' }}>(You)</span>}
                        </div>
                        <div style={{ color: '#6B7280', fontSize: '0.8125rem' }}>{staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#374151' }}>
                    {staff.department || '—'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#374151' }}>
                    {staff.role || '—'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <Badge variant={isManager ? 'info' : 'neutral'} size="sm">
                      {isManager ? 'MANAGER' : 'STAFF'}
                    </Badge>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <Badge
                      variant={
                        status === 'active'
                          ? 'success'
                          : status === 'pending'
                            ? 'warning'
                            : 'error'
                      }
                      size="sm"
                    >
                      {status.toUpperCase()}
                    </Badge>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      {status === 'pending' && (
                        <Button
                          variant="tertiary"
                          size="sm"
                          loading={resendingEmail === staff.email}
                          onClick={() => handleResendInvite(staff)}
                        >
                          Resend Invite
                        </Button>
                      )}

                      {status === 'active' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isDisableDisabled}
                          title={disableTooltip || undefined}
                          onClick={() => openDisableModal(staff)}
                        >
                          Disable
                        </Button>
                      )}

                      {status === 'disabled' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          loading={reactivatingId === staff.id}
                          onClick={() => handleReactivate(staff)}
                        >
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    )
  }

  const tabItems: TabItem[] = [
    { id: 'all', label: 'All Staff', content: renderStaffTable('all') },
    { id: 'active', label: 'Active', content: renderStaffTable('active') },
    { id: 'pending', label: 'Pending', content: renderStaffTable('pending') },
    { id: 'disabled', label: 'Disabled', content: renderStaffTable('disabled') },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* View Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
            Staff Administration
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6B7280' }}>
            Manage team access levels, invite new staff members, and configure account statuses.
          </p>
        </div>
        <Button
          variant="primary"
          leadingIcon="plus"
          onClick={() => setAddModalOpen(true)}
        >
          Add Staff Member
        </Button>
      </div>

      {/* Content Area */}
      {loading ? (
        <Card padded style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
          <Spinner size={32} />
        </Card>
      ) : errorMsg ? (
        <ErrorState
          title="Failed to Load Staff Members"
          message={errorMsg}
          onRetry={loadStaff}
        />
      ) : (
        <Tabs tabs={tabItems} />
      )}

      {/* Add Staff Modal */}
      <AddStaffModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onStaffAdded={loadStaff}
      />

      {/* Disable Staff Modal */}
      <DisableStaffModal
        open={disableModalOpen}
        onClose={() => {
          setDisableModalOpen(false)
          setDisableTarget(null)
        }}
        targetStaff={disableTarget}
        activeStaffList={staffList}
        onStaffDisabled={loadStaff}
      />
    </div>
  )
}
