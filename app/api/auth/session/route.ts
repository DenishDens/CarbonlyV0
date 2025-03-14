import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET() {
  const cookieStore = cookies()

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name, options) {
            cookieStore.set({ name, value: "", ...options })
          },
        },
      },
    )

    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return NextResponse.json({ error: error.message, status: "error" }, { status: 500 })
    }

    // Redact sensitive information
    const safeSession = data.session
      ? {
          ...data.session,
          access_token: data.session.access_token ? "[REDACTED]" : null,
          refresh_token: data.session.refresh_token ? "[REDACTED]" : null,
        }
      : null

    return NextResponse.json({
      session: safeSession,
      user: data.session?.user || null,
      status: "success",
    })
  } catch (error) {
    console.error("Error in session API route:", error)
    return NextResponse.json({ error: "Internal server error", status: "error" }, { status: 500 })
  }
}

