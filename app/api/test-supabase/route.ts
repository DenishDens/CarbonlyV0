import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { logEnvironmentInfo } from "@/lib/env"

export async function GET() {
  // Log environment info
  logEnvironmentInfo()

  try {
    // Check if Supabase URL is set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ error: "NEXT_PUBLIC_SUPABASE_URL is not set" }, { status: 500 })
    }

    // Check if service role key is set
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY is not set" }, { status: 500 })
    }

    // Create server-side Supabase client
    const supabase = createServerSupabaseClient()

    // Test a simple query
    const { data, error } = await supabase.from("users").select("count()", { count: "exact" })

    if (error) {
      return NextResponse.json({ error: `Supabase query error: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({
      message: "Successfully connected to Supabase from server",
      data: { count: data[0]?.count || 0 },
    })
  } catch (error) {
    console.error("Server Supabase test error:", error)

    return NextResponse.json({ error: `Server error: ${(error as Error).message}` }, { status: 500 })
  }
}

