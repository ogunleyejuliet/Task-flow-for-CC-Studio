import { createClient } from '@supabase/supabase-js'


/**
 * Safely retrieve public Supabase environment variables from import.meta.env or process.env.
 */
export function getSupabaseEnv() {
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as Record<string, any>).env : undefined
  const globalEnv = typeof globalThis !== 'undefined' ? (globalThis as Record<string, any>).process?.env : undefined

  const url =
    metaEnv?.NEXT_PUBLIC_SUPABASE_URL ||
    globalEnv?.NEXT_PUBLIC_SUPABASE_URL ||
    ''

  const publishableKey =
    metaEnv?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    globalEnv?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    metaEnv?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    globalEnv?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ''

  return { url, publishableKey }
}


const { url: supabaseUrl, publishableKey: supabaseKey } = getSupabaseEnv()

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase environment variables NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are missing. Check your .env.local file.'
  )
}

/**
 * Reusable client-safe Supabase client instance.
 * Uses public publishable key (or anon key) and respects Row Level Security (RLS).
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

/**
 * Helper to create a new client instance if needed (e.g. for custom scope or options).
 */
export function createBrowserSupabaseClient() {
  const { url, publishableKey } = getSupabaseEnv()
  return createClient(url, publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

