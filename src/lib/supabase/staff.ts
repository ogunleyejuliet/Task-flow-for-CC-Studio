import { supabase } from './client'
import type { ProfileRow, AccessLevel } from './types'

export interface AddStaffParams {
  email: string
  fullName: string
  department: string
  role: string
  accessLevel: AccessLevel
}

/**
 * Retrieve all staff profiles ordered by creation date.
 */
export async function fetchStaffMembers(): Promise<{ data: ProfileRow[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return { data: null, error: new Error(error.message) }
    }

    return { data: data as ProfileRow[], error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) }
  }
}

/**
 * Add a new staff member via auth signup invitation and create pending profile.
 */
export async function addStaffMember(params: AddStaffParams): Promise<{ data: ProfileRow | null; error: Error | null }> {
  try {
    // Generate a secure temporary auth passphrase for invitation initialization
    const tempAuthPass = `InitPass_${Date.now()}_${Math.random().toString(36).substring(2, 10)}!TaskFlow`
    
    const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: params.email.trim(),
      password: tempAuthPass,
      options: {
        data: {
          full_name: params.fullName.trim(),
          department: params.department.trim(),
          role: params.role.trim(),
          access_level: params.accessLevel,
        },
        emailRedirectTo: redirectTo,
      },
    })

    if (authError) {
      return { data: null, error: new Error(authError.message) }
    }

    const userId = authData.user?.id
    if (!userId) {
      return { data: null, error: new Error('Failed to obtain user ID from authentication service.') }
    }

    // Create corresponding profiles record with account_status = 'pending'
    const profilePayload: Partial<ProfileRow> = {
      id: userId,
      email: params.email.trim(),
      full_name: params.fullName.trim(),
      department: params.department.trim(),
      role: params.role.trim(),
      access_level: params.accessLevel,
      account_status: 'pending',
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert(profilePayload)
      .select()
      .single()

    if (profileError) {
      return { data: null, error: new Error(profileError.message) }
    }

    // Dispatch activation email via resetPasswordForEmail link
    await supabase.auth.resetPasswordForEmail(params.email.trim(), {
      redirectTo,
    })

    return { data: profileData as ProfileRow, error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) }
  }
}

/**
 * Resend an invitation email to a pending staff member.
 */
export async function resendStaffInvite(email: string): Promise<{ error: Error | null }> {
  try {
    const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    })

    if (error) {
      return { error: new Error(error.message) }
    }

    return { error: null }
  } catch (err) {
    return { error: err instanceof Error ? err : new Error(String(err)) }
  }
}

/**
 * Get count of open tasks assigned to a specific staff member.
 */
export async function getOpenTaskCountForUser(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('assignee_id', userId)
      .neq('status', 'completed')

    if (error) {
      console.warn('Error checking open task count:', error.message)
      return 0
    }

    return count ?? 0
  } catch {
    return 0
  }
}

/**
 * Disable a staff member, optionally reassigning open tasks to another staff member.
 */
export async function disableStaffMember({
  userId,
  reassignToUserId,
}: {
  userId: string
  reassignToUserId?: string
}): Promise<{ error: Error | null }> {
  try {
    // 1. Reassign open tasks if a replacement assignee is provided
    if (reassignToUserId) {
      const { error: reassignErr } = await supabase
        .from('tasks')
        .update({ assignee_id: reassignToUserId })
        .eq('assignee_id', userId)
        .neq('status', 'completed')

      if (reassignErr) {
        return { error: new Error(`Failed to reassign tasks: ${reassignErr.message}`) }
      }
    }

    // 2. Update profile account_status to disabled
    const { error: profileErr } = await supabase
      .from('profiles')
      .update({ account_status: 'disabled', updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (profileErr) {
      return { error: new Error(profileErr.message) }
    }

    return { error: null }
  } catch (err) {
    return { error: err instanceof Error ? err : new Error(String(err)) }
  }
}

/**
 * Reactivate a disabled staff member.
 */
export async function reactivateStaffMember(userId: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ account_status: 'active', updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (error) {
      return { error: new Error(error.message) }
    }

    return { error: null }
  } catch (err) {
    return { error: err instanceof Error ? err : new Error(String(err)) }
  }
}
