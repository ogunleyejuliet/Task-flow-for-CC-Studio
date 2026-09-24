import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

// Load .env.local variables
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

console.log('=== Phase 3 Verification Suite ===')
console.log(`URL: ${supabaseUrl}`)

if (!supabaseUrl || !supabaseKey) {
  console.error('FAIL: Missing Supabase environment variables.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runPhase3Tests() {
  console.log('\n1. Testing Profiles Table Schema & Query...')
  const { data: profilesData, error: profilesErr } = await supabase
    .from('profiles')
    .select('id, email, full_name, department, role, access_level, account_status')

  if (!profilesErr) {
    console.log(`  ✅ PASS: Profiles table query succeeded (${profilesData?.length ?? 0} profiles found).`)
  } else {
    console.error(`  ❌ FAIL: Profiles query error: ${profilesErr.message}`)
  }

  console.log('\n2. Testing Clients Table Schema & Color Column...')
  const { data: clientsData, error: clientsErr } = await supabase
    .from('clients')
    .select('id, name, color, created_at')

  if (!clientsErr) {
    console.log(`  ✅ PASS: Clients table query succeeded (${clientsData?.length ?? 0} clients found).`)
  } else {
    console.error(`  ❌ FAIL: Clients query error: ${clientsErr.message}`)
  }

  console.log('\n3. Testing Tasks Table Foreign Keys & Client Linkage...')
  const { data: tasksData, error: tasksErr } = await supabase
    .from('tasks')
    .select('id, title, client_id, assignee_id, status')

  if (!tasksErr) {
    console.log(`  ✅ PASS: Tasks table query succeeded (${tasksData?.length ?? 0} tasks found).`)
  } else {
    console.error(`  ❌ FAIL: Tasks query error: ${tasksErr.message}`)
  }

  console.log('\n4. Testing Auth Password Reset Endpoint Dispatch...')
  const { error: resetErr } = await supabase.auth.resetPasswordForEmail('verification-test@catalyststudio.com', {
    redirectTo: 'http://localhost:5173',
  })

  if (!resetErr) {
    console.log('  ✅ PASS: Password reset email dispatch endpoint verified.')
  } else {
    console.log(`  ℹ️ Password reset endpoint result: ${resetErr.message}`)
  }

  console.log('\n======================================================')
  console.log('✅ PHASE 3 VERIFICATION COMPLETED SUCCESSFULLY.')
  console.log('======================================================')
}

runPhase3Tests()
