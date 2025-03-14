// NOTE: Session handling is using temporary authentication settings
// Will be updated when proper environment variables are set up

import { createClient } from "@/lib/supabase/server"

export async function getSession() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}
