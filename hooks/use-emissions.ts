import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

export interface EmissionsData {
  total: number
  change: number
  scope1: number
  scope1Change: number
  scope2: number
  scope2Change: number
  scope3: number
  scope3Change: number
  dateRange: {
    start: string
    end: string
  }
}

export function useEmissions(dateRange: { start: string; end: string }) {
  const [data, setData] = useState<EmissionsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchEmissions() {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch current period emissions
        const { data: currentData, error: currentError } = await supabase
          .from("emissions")
          .select("*")
          .gte("date", dateRange.start)
          .lte("date", dateRange.end)

        if (currentError) throw currentError

        // If no data for current period, return early
        if (!currentData || currentData.length === 0) {
          setData(null)
          return
        }

        // Fetch previous period emissions for comparison
        const previousStart = new Date(dateRange.start)
        previousStart.setMonth(previousStart.getMonth() - 1)
        const previousEnd = new Date(dateRange.end)
        previousEnd.setMonth(previousEnd.getMonth() - 1)

        const { data: previousData, error: previousError } = await supabase
          .from("emissions")
          .select("*")
          .gte("date", previousStart.toISOString())
          .lte("date", previousEnd.toISOString())

        if (previousError) throw previousError

        // Calculate totals and changes
        const current = currentData.reduce(
          (acc, curr) => ({
            total: acc.total + curr.total,
            scope1: acc.scope1 + curr.scope1,
            scope2: acc.scope2 + curr.scope2,
            scope3: acc.scope3 + curr.scope3,
          }),
          { total: 0, scope1: 0, scope2: 0, scope3: 0 }
        )

        const previous = previousData?.reduce(
          (acc, curr) => ({
            total: acc.total + curr.total,
            scope1: acc.scope1 + curr.scope1,
            scope2: acc.scope2 + curr.scope2,
            scope3: acc.scope3 + curr.scope3,
          }),
          { total: 0, scope1: 0, scope2: 0, scope3: 0 }
        ) || { total: 0, scope1: 0, scope2: 0, scope3: 0 }

        // Calculate percentage changes
        const calculateChange = (current: number, previous: number) => {
          if (previous === 0) return current > 0 ? 100 : 0
          return ((current - previous) / previous) * 100
        }

        setData({
          total: current.total,
          change: calculateChange(current.total, previous.total),
          scope1: current.scope1,
          scope1Change: calculateChange(current.scope1, previous.scope1),
          scope2: current.scope2,
          scope2Change: calculateChange(current.scope2, previous.scope2),
          scope3: current.scope3,
          scope3Change: calculateChange(current.scope3, previous.scope3),
          dateRange,
        })
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch emissions data"))
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmissions()
  }, [dateRange])

  return { data, isLoading, error }
} 