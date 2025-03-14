"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createIncident(data: {
  title: string
  description: string
  severity: string
  category: string
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Create incident
  const { error } = await supabase.from("incidents").insert({
    title: data.title,
    description: data.description,
    severity: data.severity,
    category: data.category,
    reported_by: user.id,
    status: "open",
  })

  if (error) {
    console.error("Error creating incident:", error)
    throw new Error("Failed to create incident")
  }

  // Revalidate the incidents page
  revalidatePath("/dashboard/incidents")

  return { success: true }
}

