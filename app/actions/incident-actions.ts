"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function getIncidents(searchQuery = "") {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    let query = supabase
      .from("incidents")
      .select("id, title, description, status, created_at, updated_at, organization_id")
      .order("created_at", { ascending: false })

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
    }

    const { data, error } = await query

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching incidents:", error)
    throw error
  }
}

export async function createIncident(formData: FormData) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const status = (formData.get("status") as string) || "open"

    // Get user's organization_id
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const { data: orgData, error: orgError } = await supabase
      .from("user_organizations")
      .select("organization_id")
      .eq("user_id", userData.user.id)
      .single()

    if (orgError) throw orgError

    const { data, error } = await supabase
      .from("incidents")
      .insert([
        {
          title,
          description,
          status,
          organization_id: orgData.organization_id,
        },
      ])
      .select()

    if (error) throw error

    revalidatePath("/incidents")
    return data[0]
  } catch (error) {
    console.error("Error creating incident:", error)
    throw error
  }
}

export async function updateIncidentStatus(id: string, status: string) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.from("incidents").update({ status }).eq("id", id).select()

    if (error) throw error

    revalidatePath("/incidents")
    return data[0]
  } catch (error) {
    console.error("Error updating incident status:", error)
    throw error
  }
}

