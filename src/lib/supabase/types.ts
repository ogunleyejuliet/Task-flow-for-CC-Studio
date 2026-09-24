/**
 * Database type definitions matching the live Supabase project tables.
 */

export type AccessLevel = 'manager' | 'staff'
export type AccountStatus = 'pending' | 'active' | 'disabled'

export interface ProfileRow {
  id: string
  email: string | null
  full_name: string | null
  role: string | null
  access_level: AccessLevel | string | null
  account_status: AccountStatus | string | null
  department: string | null
  created_at: string | null
  updated_at: string | null
}

export interface ClientRow {
  id: string
  name: string
  color?: string | null
  created_at: string | null
  updated_at: string | null
}

export interface TaskRow {
  id: string
  title: string
  description: string | null
  status: 'to-do' | 'in-progress' | 'completed' | 'blocked' | string
  priority: 'low' | 'medium' | 'high' | 'urgent' | string
  due_date: string | null
  client_id: string | null
  assignee_id: string | null
  creator_id: string | null
  created_at: string | null
  updated_at: string | null
  completed_at: string | null
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: Partial<ProfileRow>
        Update: Partial<ProfileRow>
      }
      clients: {
        Row: ClientRow
        Insert: Partial<ClientRow>
        Update: Partial<ClientRow>
      }
      tasks: {
        Row: TaskRow
        Insert: Partial<TaskRow>
        Update: Partial<TaskRow>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

