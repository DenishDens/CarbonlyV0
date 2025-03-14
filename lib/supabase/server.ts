import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from './types'
import type { CookieOptions } from '@supabase/ssr'
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies"

const REQUIRED_ENV_VARS = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const

// Validate environment variables at startup
Object.entries(REQUIRED_ENV_VARS).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing ${key} environment variable`)
  }
})

export function createClient() {
  // Assert environment variables are defined since we checked above
  const supabaseUrl = REQUIRED_ENV_VARS.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = REQUIRED_ENV_VARS.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Get cookie store with proper type
  const cookieStore = cookies() as RequestCookies

  return createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        set(name: string, value: string, options: CookieOptions = {}) {
          try {
            cookieStore.set(name, value, {
              path: '/',
              ...options,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production'
            })
          } catch (error) {
            console.error('Error setting cookie:', error)
          }
        },
        remove(name: string, options: CookieOptions = {}) {
          try {
            cookieStore.set(name, '', {
              path: '/',
              ...options,
              maxAge: 0,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production'
            })
          } catch (error) {
            console.error('Error removing cookie:', error)
          }
        }
      }
    }
  )
}
