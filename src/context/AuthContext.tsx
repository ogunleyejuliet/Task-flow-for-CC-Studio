/* oxlint-disable react/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase/client'
import type { ProfileRow, AccessLevel, AccountStatus } from '../lib/supabase/types'

export interface AuthContextType {
  session: Session | null
  user: User | null
  profile: ProfileRow | null
  loading: boolean
  accessLevel: AccessLevel
  accountStatus: AccountStatus
  isManager: boolean
  isStaff: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching user profile:', error.message)
        setProfile(null)
        return
      }

      if (data) {
        setProfile(data)
      } else {

        setProfile(null)
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err)
      setProfile(null)
    }
  }

  useEffect(() => {
    let mounted = true

    // Initial session retrieval
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).finally(() => {
          if (mounted) setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return
      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user) {
        await fetchProfile(newSession.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Derive access_level: MUST come from access_level column ('manager' | 'staff'), NOT descriptive role
  const rawAccessLevel = profile?.access_level?.toLowerCase()
  const accessLevel: AccessLevel = rawAccessLevel === 'manager' ? 'manager' : 'staff'
  const isManager = accessLevel === 'manager'
  const isStaff = accessLevel === 'staff'

  // Derive account_status: ('pending' | 'active' | 'disabled')
  const rawStatus = profile?.account_status?.toLowerCase()
  const accountStatus: AccountStatus =
    rawStatus === 'pending'
      ? 'pending'
      : rawStatus === 'disabled'
        ? 'disabled'
        : 'active'

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    setProfile(null)
    setLoading(false)
  }

  const handleRefreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        accessLevel,
        accountStatus,
        isManager,
        isStaff,
        signOut: handleSignOut,
        refreshProfile: handleRefreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
