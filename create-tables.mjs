import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('🚀 Creating database tables...\n')
console.log('Supabase URL:', supabaseUrl)
console.log('Using key:', supabaseKey ? 'Present' : 'Missing')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Read the schema SQL
const schema = fs.readFileSync('./database/schema.sql', 'utf8')

// Split by semicolon and execute each statement
const statements = schema
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('/*') && !s.startsWith('--'))

console.log(`Found ${statements.length} SQL statements to execute\n`)

async function createTables() {
  try {
    // Try to check if we can connect
    const { data, error } = await supabase.from('countries').select('count').limit(1)
    
    if (!error) {
      console.log('✅ Tables already exist! Database is set up.')
      console.log('\nYou can now click "Populate Database" button in the app.')
      return
    }
    
    console.log('Tables need to be created. Attempting to create...\n')
    console.log('⚠️  Note: Table creation requires admin access.')
    console.log('Please use the Supabase dashboard or ask Bolt to run the migration.\n')
    
  } catch (err) {
    console.error('Error checking tables:', err.message)
  }
}

createTables()
