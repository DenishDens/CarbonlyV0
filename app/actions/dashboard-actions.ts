"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function getDashboardStats() {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Fetch emissions data
    const { data: emissionsData, error: emissionsError } = await supabase.from("emission_data").select("amount")

    if (emissionsError) throw emissionsError

    // Calculate total manually
    const totalEmissions = emissionsData?.reduce((sum, item) => sum + (Number.parseFloat(item.amount) || 0), 0) || 0

    // Fetch incidents
    const { data: incidentsData, error: incidentsError } = await supabase.from("incidents").select("status")

    if (incidentsError) throw incidentsError

    // Count manually
    const openIncidents = incidentsData?.filter((incident) => incident.status === "open").length || 0

    // Fetch projects
    const { data: projectsData, error: projectsError } = await supabase.from("projects").select("id")

    if (projectsError) throw projectsError

    return {
      totalEmissions,
      openIncidents,
      projectsCount: projectsData?.length || 0,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    throw error
  }
}

