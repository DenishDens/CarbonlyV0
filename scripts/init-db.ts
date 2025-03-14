import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function initializeDatabase() {
  try {
    console.log("Initializing database...")

    // Read SQL files
    const setupSql = fs.readFileSync(path.join(process.cwd(), "db", "setup.sql"), "utf8")
    const securitySql = fs.readFileSync(path.join(process.cwd(), "db", "security_policies.sql"), "utf8")
    const seedSql = fs.readFileSync(path.join(process.cwd(), "db", "seed.sql"), "utf8")

    // Execute setup SQL
    console.log("Creating tables...")
    const { error: setupError } = await supabase.rpc("exec_sql", { sql: setupSql })
    if (setupError) {
      throw new Error(`Error creating tables: ${setupError.message}`)
    }

    // Execute security policies SQL
    console.log("Setting up security policies...")
    const { error: securityError } = await supabase.rpc("exec_sql", { sql: securitySql })
    if (securityError) {
      throw new Error(`Error setting up security policies: ${securityError.message}`)
    }

    // Execute seed SQL
    console.log("Seeding database...")
    const { error: seedError } = await supabase.rpc("exec_sql", { sql: seedSql })
    if (seedError) {
      throw new Error(`Error seeding database: ${seedError.message}`)
    }

    console.log("Database initialization complete!")
  } catch (error) {
    console.error("Error initializing database:", error)
    process.exit(1)
  }
}

initializeDatabase()

