/**
 * Environment utilities for the Carbonly application
 */

// Check if we're running on the server
const isServer = typeof window === "undefined"

// Required environment variables
const CLIENT_ENV_VARS = ["NEXT_PUBLIC_SUPABASE_ANON_KEY"]

/**
 * Gets the application URL based on the environment
 */
export function getAppUrl() {
  // For local development, always use localhost:3004
  return "http://localhost:3004"
}

/**
 * Checks if all required environment variables are set
 */
export function checkRequiredEnvVars() {
  const missing = CLIENT_ENV_VARS.filter((key) => !process.env[key])

  return {
    isComplete: missing.length === 0,
    missing,
    missingServer: []
  }
}

/**
 * Gets all public environment variables
 */
export function getAllPublicEnv() {
  const env: Record<string, string> = {}
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith("NEXT_PUBLIC_")) {
      env[key] = process.env[key] || ""
    }
  })
  return env
}

/**
 * Logs environment information for debugging
 */
export function logEnvironmentInfo() {
  if (isServer) {
    console.log("Server Environment:", {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Not set",
    })
  } else {
    console.log("Client Environment:", {
      NODE_ENV: process.env.NODE_ENV,
      window_location: window.location.href,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set",
    })
  }
}
