"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export interface Incident {
  id: string
  title: string
  description: string
  status: string
  created_at: string
  updated_at: string
  organization_id: string
}

export function useIncidents(searchQuery = "") {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchIncidents() {
      try {
        setIsLoading(true)
        setError(null)

        const supabase = createClient()

        let query = supabase
          .from("incidents")
          .select("id, title, description, status, created_at, updated_at, organization_id")
          .order("created_at", { ascending: false })

        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        }

        const { data, error } = await query

        if (error) throw new Error(error.message)

        setIncidents(data || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchIncidents()
  }, [searchQuery])

  return { incidents, isLoading, error }
}

