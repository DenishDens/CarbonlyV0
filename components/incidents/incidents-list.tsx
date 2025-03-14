"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Incident, IncidentSeverity, IncidentStatus } from "@/types/incidents"
import { Database } from "@/lib/supabase/types"

interface IncidentsListProps {
  organizationId: string
}

export function IncidentsList({ organizationId }: IncidentsListProps) {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const supabase = createClient()

        // Check if the incidents table exists and user has access
        const { error: tableCheckError } = await supabase
          .from("incidents")
          .select("id")
          .eq("organization_id", organizationId)
          .limit(1)
          .single()

        if (tableCheckError) {
          if (tableCheckError.message.includes("does not exist")) {
            setError("The incidents tracking system is not yet set up. Please contact support.")
          } else if (tableCheckError.code === "PGRST116") {
            setError("You don't have access to view incidents. Please check your permissions.")
          } else {
            console.error("Error checking incidents table:", tableCheckError)
            setError("Unable to access incidents. Please try again later.")
          }
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("incidents")
          .select("*")
          .eq("organization_id", organizationId)
          .order("created_at", { ascending: false })
          .limit(5)

        if (error) throw error

        setIncidents(data || [])
        setLoading(false)
      } catch (err: any) {
        console.error("Error fetching incidents:", err)
        setError("Failed to load incidents. Please try again later.")
        setLoading(false)
      }
    }

    if (organizationId) {
      fetchIncidents()
    }
  }, [organizationId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
          <CardDescription>Loading incidents...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
          <CardDescription>System status and recent issues</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Incidents</CardTitle>
        <CardDescription>System status and recent issues</CardDescription>
      </CardHeader>
      <CardContent>
        {incidents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No incidents reported. All systems operational.</p>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div key={incident.id} className="border-l-4 border-yellow-500 pl-4 py-2">
                <h3 className="font-medium">{incident.title}</h3>
                <p className="text-sm text-muted-foreground">{incident.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      incident.severity === "high"
                        ? "bg-red-100 text-red-800"
                        : incident.severity === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {incident.severity}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      incident.status === "resolved"
                        ? "bg-green-100 text-green-800"
                        : incident.status === "in_progress"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {incident.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(incident.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
