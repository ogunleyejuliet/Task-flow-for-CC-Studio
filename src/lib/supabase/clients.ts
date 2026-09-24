import { supabase } from './client'
import type { ClientRow } from './types'

export interface CreateClientParams {
  name: string
  color?: string
}

export interface UpdateClientParams {
  id: string
  name: string
  color?: string
}

/**
 * Fetch all clients sorted alphabetically by name.
 */
export async function fetchClients(): Promise<{ data: ClientRow[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    return { data: data as ClientRow[], error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) }
  }
}

/**
 * Create a new client, checking for case-insensitive duplicate names.
 */
export async function createClient(params: CreateClientParams): Promise<{ data: ClientRow | null; error: Error | null }> {
  const trimmedName = params.name.trim()
  if (!trimmedName) {
    return { data: null, error: new Error('Client name is required.') }
  }

  try {
    // Case-insensitive duplicate check
    const { data: existing, error: checkErr } = await supabase
      .from('clients')
      .select('id, name')

    if (!checkErr && existing) {
      const duplicate = existing.find(
        (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
      )
      if (duplicate) {
        return { data: null, error: new Error(`A client named "${trimmedName}" already exists.`) }
      }
    }

    const { data, error } = await supabase
      .from('clients')
      .insert({
        name: trimmedName,
        color: params.color || '#2F6DB5',
      })
      .select()
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    return { data: data as ClientRow, error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) }
  }
}

/**
 * Update an existing client's details.
 */
export async function updateClient(params: UpdateClientParams): Promise<{ data: ClientRow | null; error: Error | null }> {
  const trimmedName = params.name.trim()
  if (!trimmedName) {
    return { data: null, error: new Error('Client name is required.') }
  }

  try {
    // Case-insensitive duplicate check excluding self
    const { data: existing, error: checkErr } = await supabase
      .from('clients')
      .select('id, name')

    if (!checkErr && existing) {
      const duplicate = existing.find(
        (c) => c.id !== params.id && c.name.toLowerCase() === trimmedName.toLowerCase()
      )
      if (duplicate) {
        return { data: null, error: new Error(`Another client named "${trimmedName}" already exists.`) }
      }
    }

    const { data, error } = await supabase
      .from('clients')
      .update({
        name: trimmedName,
        color: params.color || '#2F6DB5',
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    return { data: data as ClientRow, error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) }
  }
}

/**
 * Get total number of tasks associated with a client.
 */
export async function getTaskCountForClient(clientId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId)

    if (error) {
      console.warn('Error checking task count for client:', error.message)
      return 0
    }

    return count ?? 0
  } catch {
    return 0
  }
}

/**
 * Delete a client after verifying no tasks are linked.
 */
export async function deleteClient(clientId: string): Promise<{ error: Error | null }> {
  try {
    // Check if tasks are associated with this client
    const taskCount = await getTaskCountForClient(clientId)
    if (taskCount > 0) {
      return {
        error: new Error(
          `Cannot delete client. There are ${taskCount} task(s) currently associated with this client. Please reassign or delete those tasks first.`
        ),
      }
    }

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId)

    if (error) {
      return { error: new Error(error.message) }
    }

    return { error: null }
  } catch (err) {
    return { error: err instanceof Error ? err : new Error(String(err)) }
  }
}
