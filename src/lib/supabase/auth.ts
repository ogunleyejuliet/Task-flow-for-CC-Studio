import type { AuthResponse, Session, User, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase } from './client'

export interface SignUpOptions {
  email: string
  password: string
  fullName?: string
  redirectTo?: string
}

export interface SignInOptions {
  email: string
  password: string
}

export interface ResetPasswordOptions {
  email: string
  redirectTo?: string
}

/**
 * Sign up a new user using email and password.
 */
export async function signUp({
  email,
  password,
  fullName,
  redirectTo,
}: SignUpOptions): Promise<AuthResponse> {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: redirectTo,
    },
  })
}

/**
 * Sign in existing user with email and password.
 */
export async function signInWithPassword({
  email,
  password,
}: SignInOptions): Promise<AuthResponse> {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

/**
 * Sign out the currently authenticated user session.
 */
export async function signOut(): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Retrieve current active session.
 */
export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession()
  return data.session
}

/**
 * Retrieve current authenticated user details.
 */
export async function getUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser()
  return data.user
}

/**
 * Subscribe to auth state changes (sign in, sign out, token refreshed, password recovery).
 */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
  return subscription
}

/**
 * Send password reset email to user.
 */
export async function resetPasswordForEmail({
  email,
  redirectTo,
}: ResetPasswordOptions) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  })
}
