import { useState, useEffect, useCallback } from 'react'
import { Card } from '../Card/Card'
import { Button } from '../Button/Button'
import { Spinner } from '../Spinner/Spinner'
import { EmptyState } from '../EmptyState/EmptyState'
import { ErrorState } from '../ErrorState/ErrorState'
import { ClientModal } from './ClientModal'
import { DeleteClientModal } from './DeleteClientModal'
import { fetchClients, getTaskCountForClient } from '../../lib/supabase/clients'
import type { ClientRow } from '../../lib/supabase/types'

interface ClientWithTaskCount extends ClientRow {
  taskCount?: number
}

export function ClientManagementView() {
  const [clients, setClients] = useState<ClientWithTaskCount[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientRow | null>(null)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletingClient, setDeletingClient] = useState<ClientRow | null>(null)

  const loadClients = useCallback(async () => {
    setLoading(true)
    setErrorMsg(null)
    const { data, error } = await fetchClients()
    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
      return
    }

    const clientList = data || []
    // Fetch associated task count for each client
    const withCounts = await Promise.all(
      clientList.map(async (client) => {
        const count = await getTaskCountForClient(client.id)
        return { ...client, taskCount: count }
      })
    )

    setClients(withCounts)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadClients()
  }, [loadClients])

  const handleOpenAddModal = () => {
    setEditingClient(null)
    setModalOpen(true)
  }

  const handleOpenEditModal = (client: ClientRow) => {
    setEditingClient(client)
    setModalOpen(true)
  }

  const handleOpenDeleteModal = (client: ClientRow) => {
    setDeletingClient(client)
    setDeleteModalOpen(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
            Client Administration
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6B7280' }}>
            Create and manage agency client records and color tags for task organization.
          </p>
        </div>
        <Button variant="primary" leadingIcon="plus" onClick={handleOpenAddModal}>
          Add Client
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <Card padded style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
          <Spinner size={32} />
        </Card>
      ) : errorMsg ? (
        <ErrorState
          title="Failed to Load Clients"
          message={errorMsg}
          onRetry={loadClients}
        />
      ) : clients.length === 0 ? (
        <EmptyState
          title="No Clients Created"
          description="Your agency hasn't created any clients yet. Add a client to start tagging tasks."
          action={
            <Button variant="primary" onClick={handleOpenAddModal}>
              Add First Client
            </Button>
          }
        />
      ) : (
        <Card padded variant="elevated" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Client Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Color Tag</th>
                <th style={{ padding: '0.75rem 1rem' }}>Associated Tasks</th>
                <th style={{ padding: '0.75rem 1rem' }}>Created Date</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => {
                const colorTag = client.color || '#2F6DB5'
                const formattedDate = client.created_at
                  ? new Date(client.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '—'

                return (
                  <tr key={client.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#111827' }}>
                      {client.name}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            backgroundColor: colorTag,
                            display: 'inline-block',
                          }}
                        />
                        <span style={{ fontSize: '0.8125rem', fontFamily: 'monospace', color: '#4B5563' }}>
                          {colorTag}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#374151' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          backgroundColor: client.taskCount && client.taskCount > 0 ? '#E0F2FE' : '#F3F4F6',
                          color: client.taskCount && client.taskCount > 0 ? '#0369A1' : '#6B7280',
                          fontWeight: 500,
                          fontSize: '0.8125rem',
                        }}
                      >
                        {client.taskCount ?? 0} task(s)
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#6B7280' }}>
                      {formattedDate}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenEditModal(client)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleOpenDeleteModal(client)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}

      {/* Add / Edit Client Modal */}
      <ClientModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingClient(null)
        }}
        clientToEdit={editingClient}
        onClientSaved={loadClients}
      />

      {/* Delete Client Modal */}
      <DeleteClientModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setDeletingClient(null)
        }}
        targetClient={deletingClient}
        onClientDeleted={loadClients}
      />
    </div>
  )
}
