import { supabase, getSupabaseEnv } from './client'

export interface ConnectionTestResult {
  success: boolean
  url: string
  message: string
  details?: {
    profilesStatus?: string
    clientsStatus?: string
    tasksStatus?: string
    sessionDetected?: boolean
  }
  error?: string
}

/**
 * Executes a safe connection test against the Supabase project.
 * Uses public publishable key and normal client connection without bypassing RLS.
 */
export async function verifySupabaseConnection(): Promise<ConnectionTestResult> {
  const { url, publishableKey } = getSupabaseEnv()

  if (!url || !publishableKey) {
    return {
      success: false,
      url: url || 'MISSING',
      message: 'Supabase URL or Publishable Key is missing from environment variables.',
      error: 'Missing environment configuration',
    }
  }

  try {
    // 1. Verify health / database table query (safe query respecting RLS)
    const { count: tasksCount, error: tasksError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })

    const { count: profilesCount, error: profilesError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const { count: clientsCount, error: clientsError } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })

    // 2. Check auth session status
    const { data: authData, error: authError } = await supabase.auth.getSession()

    // If PostgREST query completed without query structure error, communication was successful!
    const isConnected = !tasksError || tasksError.code === 'PGRST116' || !authError

    if (isConnected) {
      return {
        success: true,
        url,
        message: 'Successfully established connection to Supabase project.',
        details: {
          profilesStatus: profilesError ? `RLS Active / ${profilesError.message}` : `Accessible (${profilesCount ?? 0} items)`,
          clientsStatus: clientsError ? `RLS Active / ${clientsError.message}` : `Accessible (${clientsCount ?? 0} items)`,
          tasksStatus: tasksError ? `RLS Active / ${tasksError.message}` : `Accessible (${tasksCount ?? 0} items)`,
          sessionDetected: Boolean(authData.session),
        },
      }
    }

    return {
      success: false,
      url,
      message: 'Failed to communicate with Supabase backend.',
      error: tasksError?.message || authError?.message || 'Unknown connection error',
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    return {
      success: false,
      url,
      message: 'Connection test threw an unexpected error.',
      error: errorMessage,
    }
  }
}
