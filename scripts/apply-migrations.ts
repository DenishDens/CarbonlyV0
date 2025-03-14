import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = 'https://ssmlioeunpqifbkwafct.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzbWxpb2V1bnBqaWZia3dhZmN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTYxMjEwNSwiZXhwIjoyMDU3MTg4MTA1fQ.HnFDZC3-GuxmZqzlmbutcsQnf1Dt1HbRmWv4mq52Lvc'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function applyMigrations(): Promise<void> {
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20240314_initial_schema.sql')
    const migrationSql = fs.readFileSync(migrationPath, 'utf8')

    // Split the migration into individual statements
    const statements = migrationSql
      .split(';')
      .map((statement: string) => statement.trim())
      .filter((statement: string) => statement.length > 0)

    console.log('Applying migrations...')

    // Execute each statement
    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', { sql: statement })
      if (error) {
        console.error('Error executing statement:', error)
        console.error('Statement:', statement)
      }
    }

    console.log('Migrations completed successfully')
  } catch (error) {
    console.error('Error applying migrations:', error)
  }
}

applyMigrations()
