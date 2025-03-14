import { exec } from 'child_process'
import { promisify } from 'util'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const execAsync = promisify(exec)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    // Run the migration
    console.log('Running database migration...')
    const { stdout, stderr } = await execAsync('supabase db reset')
    console.log(stdout)
    if (stderr) console.error(stderr)

    // Run the user setup script
    console.log('Setting up users...')
    const { stdout: userSetupOutput, stderr: userSetupError } = await execAsync('ts-node scripts/setup-users.ts')
    console.log(userSetupOutput)
    if (userSetupError) console.error(userSetupError)

    console.log('Database setup completed successfully!')
  } catch (error) {
    console.error('Error setting up database:', error)
    process.exit(1)
  }
}

setupDatabase() 