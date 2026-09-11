import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim()
      }
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function inspectAll() {
  const tasksCols = ['id', 'name', 'title', 'description', 'status', 'priority', 'due_date', 'dueDate', 'project_id', 'client_id', 'assignee_id', 'creator_id', 'created_at', 'updated_at', 'completed_at']
  const clientsCols = ['id', 'name', 'email', 'company', 'status', 'color_tag', 'colorTag', 'created_at', 'updated_at']

  const existingTasks = []
  for (const c of tasksCols) {
    const { error } = await supabase.from('tasks').select(c).limit(1)
    if (!error) existingTasks.push(c)
  }

  const existingClients = []
  for (const c of clientsCols) {
    const { error } = await supabase.from('clients').select(c).limit(1)
    if (!error) existingClients.push(c)
  }

  console.log('=== Tasks Columns ===', existingTasks)
  console.log('=== Clients Columns ===', existingClients)
}

inspectAll()
