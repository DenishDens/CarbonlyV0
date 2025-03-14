"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface DashboardStats {
  totalEmissions: number
  openIncidents: number
  projectsCount: number
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmissions: 0,
    openIncidents: 0,
    projectsCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true)
        setError(null)

        const supabase = createClient()

        // Fetch total emissions - avoid using aggregate functions directly
        const { data: emissionsData, error: emissionsError } = await supabase.from("emission_data").select("amount")

        if (emissionsError) throw new Error(emissionsError.message)

        // Calculate total manually instead of using SUM()
        const totalEmissions = emissionsData?.reduce((sum, item) => sum + (Number.parseFloat(item.amount) || 0), 0) || 0

        // Fetch open incidents
        const { data: incidentsData, error: incidentsError } = await supabase
          .from("incidents")
          .select("id")
          .eq("status", "open")

        if (incidentsError) throw new Error(incidentsError.message)

        // Count manually instead of using COUNT()
        const openIncidents = incidentsData?.length || 0

        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase.from("projects").select("id")

        if (projectsError) throw new Error(projectsError.message)

        // Count manually instead of using COUNT()
        const projectsCount = projectsData?.length || 0

        setStats({
          totalEmissions,
          openIncidents,
          projectsCount,
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, isLoading, error }
}

