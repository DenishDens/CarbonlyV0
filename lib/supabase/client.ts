"use client"

import { createClient as createBrowserClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { logger } from '@/lib/logger'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createClient = () => {
  const client = createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      db: {
        schema: 'public'
      },
      global: {
        headers: {
          'x-my-custom-header': 'carbonly-ai'
        }
      }
    }
  )

  // Add auth event listeners
  client.auth.onAuthStateChange((event, session) => {
    logger.info("Auth", `Auth state changed: ${event}`, { userId: session?.user?.id })
  })

  return client
}

// Create a singleton instance
const supabase = createClient()

export { supabase }
