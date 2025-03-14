import { NextResponse } from "next/server"

export async function GET() {
  // Check if environment variables are set
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Not set",
    NODE_ENV: process.env.NODE_ENV || "Not set",
  }

  return NextResponse.json({
    message: "Environment variables check",
    variables: envVars,
    timestamp: new Date().toISOString(),
  })
}

