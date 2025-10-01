import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Load env file manually
const envContent = readFileSync('.env', 'utf8')
const envLines = envContent.split('\n')
let supabaseUrl, supabaseKey

envLines.forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim()
  }
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
    supabaseKey = line.split('=')[1].trim()
  }
})

console.log('🔍 Checking database status...\n')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAndCreateTables() {
  try {
    // Check if tables exist by trying to query
    const { data, error } = await supabase.from('countries').select('count').limit(1)
    
    if (!error) {
      console.log('✅ Database tables already exist!')
      console.log('\n📋 Next step: Go to the app and click "Populate Database" button\n')
      
      // List all tables
      const tables = ['countries', 'invitation_status', 'guest_invitations', 'guest_responses', 'guest_activities', 'settings', 'media', 'admin_users']
      console.log('Available tables:')
      for (const table of tables) {
        const { error: tableError } = await supabase.from(table).select('count').limit(1)
        if (!tableError) {
          console.log(`  ✓ ${table}`)
        }
      }
      return
    }
    
    if (error.message.includes('relation') || error.message.includes('does not exist')) {
      console.log('❌ Tables do not exist yet\n')
      console.log('📝 To create tables, please run this in Bolt chat or Supabase dashboard:\n')
      console.log('---')
      console.log(readFileSync('./database/schema.sql', 'utf8'))
      console.log('---\n')
    } else {
      console.log('Error:', error.message)
    }
    
  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

checkAndCreateTables()
