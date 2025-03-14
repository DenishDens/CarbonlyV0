import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "http://127.0.0.1:54321"
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RZcFlFzikRfrd2Tp8JXzksZ9L7AY6VENcX-Z4"

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createTestUsers() {
  try {
    // Create admin user
    const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
      email: "admin@carbonly.ai",
      password: "admin123",
      email_confirm: true,
    })

    if (adminError) {
      console.error("Error creating admin user:", adminError)
      return
    }

    console.log("Admin user created:", adminData)

    // Create regular user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: "user@carbonly.ai",
      password: "user123",
      email_confirm: true,
    })

    if (userError) {
      console.error("Error creating regular user:", userError)
      return
    }

    console.log("Regular user created:", userData)
  } catch (error) {
    console.error("Error:", error)
  }
}

createTestUsers() 