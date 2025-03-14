import fs from "fs"
import path from "path"
import { createClient } from "@supabase/supabase-js"

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runSqlFile(filePath: string) {
  try {
    const sql = fs.readFileSync(path.join(process.cwd(), filePath), "utf8")

    // Split the SQL file into individual statements
    const statements = sql
      .split(";")
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0)

    console.log(`Running ${statements.length} SQL statements from ${filePath}`)

    for (const statement of statements) {
      const { error } = await supabase.rpc("exec_sql", { sql: statement + ";" })

      if (error) {
        console.error(`Error executing SQL: ${error.message}`)
        console.error(`Statement: ${statement}`)
      }
    }

    console.log(`Successfully executed ${filePath}`)
  } catch (error) {
    console.error(`Error running SQL file ${filePath}:`, error)
  }
}

async function setupDatabase() {
  try {
    console.log("Setting up Supabase database...")

    // Run the setup SQL file
    await runSqlFile("db/setup.sql")

    // Run the security policies SQL file
    await runSqlFile("db/security_policies.sql")

    // Run the seed data SQL file
    await runSqlFile("db/seed.sql")

    console.log("Database setup complete!")
  } catch (error) {
    console.error("Error setting up database:", error)
  }
}

setupDatabase()

