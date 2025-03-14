import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { getAppUrl } from "./env"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Create a function to safely get the Supabase client
const getSupabaseClient = () => {
  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // During build time, provide a mock client
  if ((!supabaseUrl || !supabaseAnonKey) && !isBrowser) {
    console.warn("Supabase environment variables missing during build. Using mock client.")
    return createMockClient()
  }

  // In browser with missing variables
  if ((!supabaseUrl || !supabaseAnonKey) && isBrowser) {
    console.error("Supabase environment variables are missing in the browser.")
    return createMockClient()
  }

  // Create and return the real client
  return createClient<Database>(supabaseUrl as string, supabaseAnonKey as string, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // Set the site URL for auth redirects to the custom domain
      site: getAppUrl(),
    },
    global: {
      headers: {
        "X-Client-Info": "carbonly-app",
      },
    },
  })
}

// Create a mock client
const createMockClient = () => ({
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ data: null, error: new Error("Supabase not configured") }),
    signUp: async () => ({ data: null, error: new Error("Supabase not configured") }),
    signOut: async () => ({ error: null }),
  },
  from: () => ({
    select: async () => ({ data: null, error: new Error("Supabase not configured") }),
    insert: async () => ({ data: null, error: new Error("Supabase not configured") }),
    update: async () => ({ data: null, error: new Error("Supabase not configured") }),
    delete: async () => ({ data: null, error: new Error("Supabase not configured") }),
  }),
  rpc: async () => ({ data: null, error: new Error("Supabase not configured") }),
})

// Use a lazy initialization pattern
let supabaseInstance: ReturnType<typeof getSupabaseClient> | null = null

export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = getSupabaseClient()
  }
  return supabaseInstance
}

// For backward compatibility
export const supabase = getSupabase()

// Server-side client with service role
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // During build time, provide a mock client
  if ((!supabaseUrl || !serviceKey) && !isBrowser) {
    console.warn("Server Supabase environment variables missing during build. Using mock client.")
    return createMockClient()
  }

  return createClient<Database>(supabaseUrl as string, serviceKey as string, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        "X-Client-Info": "carbonly-server",
      },
    },
  })
}

