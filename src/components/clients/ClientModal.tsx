import { useState, useEffect, type FormEvent } from 'react'
import { Modal } from '../Modal/Modal'
import { Input } from '../Input/Input'
import { Button } from '../Button/Button'
import { useToast } from '../../index'
import { createClient, updateClient } from '../../lib/supabase/clients'
import type { ClientRow } from '../../lib/supabase/types'

export interface ClientModalProps {
  open: boolean
  onClose: () => void
  clientToEdit: ClientRow | null
  onClientSaved: () => void
}

const PRESET_COLORS = [
  { name: 'TaskFlow Blue', hex: '#2F6DB5' },
  { name: 'Sky Blue', hex: '#6DA8F0' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Violet', hex: '#8B5CF6' },
  { name: 'Rose', hex: '#F43F5E' },
  { name: 'Slate', hex: '#475569' },
]

export function ClientModal({ open, onClose, clientToEdit, onClientSaved }: ClientModalProps) {
  const toast = useToast()

  const [name, setName] = useState('')
  const [color, setColor] = useState('#2F6DB5')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const isEditing = Boolean(clientToEdit)

  useEffect(() => {
    if (open) {
      setErrorMsg(null)
      if (clientToEdit) {
        setName(clientToEdit.name || '')
        setColor(clientToEdit.color || '#2F6DB5')
      } else {
        setName('')
        setColor('#2F6DB5')
      }
    }
  }, [open, clientToEdit])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!name.trim()) {
      setErrorMsg('Client name is required.')
      return
    }

    setSubmitting(true)
    try {
      if (isEditing && clientToEdit) {
        const { error } = await updateClient({
          id: clientToEdit.id,
          name: name.trim(),
          color,
        })
        if (error) {
          setErrorMsg(error.message)
          setSubmitting(false)
          return
        }
        toast.push({
          title: 'Client Updated',
          description: `Client details for "${name.trim()}" have been saved.`,
          variant: 'success',
        })
      } else {
        const { error } = await createClient({
          name: name.trim(),
          color,
        })
        if (error) {
          setErrorMsg(error.message)
          setSubmitting(false)
          return
        }
        toast.push({
          title: 'Client Created',
          description: `Client "${name.trim()}" has been successfully added.`,
          variant: 'success',
        })
      }

      onClientSaved()
      onClose()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred while saving client.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Client' : 'Add New Client'}
      description={
        isEditing
          ? 'Modify client name or color tag.'
          : 'Create a new client record for tagging agency tasks.'
      }
      size="md"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', width: '100%' }}>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={submitting}>
            {isEditing ? 'Save Changes' : 'Create Client'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
          label="Client Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Acme Corp, Catalyst Marketing"
          helperText="Client names must be unique (case-insensitive)."
        />

        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151',
            }}
          >
            Color Tag
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {PRESET_COLORS.map((preset) => {
              const isSelected = color.toLowerCase() === preset.hex.toLowerCase()
              return (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => setColor(preset.hex)}
                  title={preset.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: preset.hex,
                    border: isSelected ? '3px solid #111827' : '2px solid #ffffff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'transform 0.1s ease',
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
              )
            })}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              title="Custom Color"
              style={{
                width: '32px',
                height: '32px',
                padding: 0,
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                backgroundColor: 'transparent',
              }}
            />
          </div>
        </div>
      </form>
    </Modal>
  )
}
