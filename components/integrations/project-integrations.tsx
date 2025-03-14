"use client"

import { useState, useEffect } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "../ui/empty-state"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import type { Database } from "@/types/supabase"
import { Link2, FileSpreadsheet, FileText, CreditCard } from "lucide-react"

interface ProjectIntegrationsProps {
  projectId: string
}

type Integration = Database["public"]["Tables"]["integrations"]["Row"]

export function ProjectIntegrations({ projectId }: ProjectIntegrationsProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [organizationId, setOrganizationId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchIntegrations() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        // Get user's organization
        const { data: orgUser } = await supabase
          .from("organization_users")
          .select("organization_id")
          .eq("user_id", user.id)
          .single()

        if (!orgUser) return

        setOrganizationId(orgUser.organization_id)

        // Get project integrations
        const { data } = await supabase.from("integrations").select("*").eq("project_id", projectId)

        if (data) {
          setIntegrations(data)
        }
      } catch (error) {
        console.error("Error fetching integrations:", error)
        toast({
          title: "Error",
          description: "Failed to load integrations",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchIntegrations()
  }, [projectId])

  const handleConnectIntegration = async (type: string) => {
    if (!organizationId) return

    try {
      // This would typically open an OAuth flow or configuration modal
      // For now, we'll just simulate adding an integration
      const { data, error } = await supabase
        .from("integrations")
        .insert({
          organization_id: organizationId,
          project_id: projectId,
          type,
          name: getIntegrationName(type),
          status: "connected",
          config: {},
        })
        .select()
        .single()

      if (error) throw error

      setIntegrations([...integrations, data])

      toast({
        title: "Integration Connected",
        description: `Successfully connected to ${getIntegrationName(type)}`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to connect integration",
        variant: "destructive",
      })
    }
  }

  const handleDisconnectIntegration = async (id: string) => {
    try {
      const { error } = await supabase.from("integrations").delete().eq("id", id)

      if (error) throw error

      setIntegrations(integrations.filter((i) => i.id !== id))

      toast({
        title: "Integration Disconnected",
        description: "Successfully disconnected integration",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to disconnect integration",
        variant: "destructive",
      })
    }
  }

  function getIntegrationName(type: string): string {
    switch (type) {
      case "onedrive":
        return "Microsoft OneDrive"
      case "googledrive":
        return "Google Drive"
      case "xero":
        return "Xero"
      case "myob":
        return "MYOB"
      case "jotform":
        return "JotForm"
      default:
        return "Custom Integration"
    }
  }

  function getIntegrationIcon(type: string) {
    switch (type) {
      case "onedrive":
      case "googledrive":
        return FileText
      case "xero":
      case "myob":
        return FileSpreadsheet
      case "jotform":
        return CreditCard
      default:
        return Link2
    }
  }

  if (loading) {
    return <div>Loading integrations...</div>
  }

  if (integrations.length === 0) {
    return (
      <EmptyState
        title="No Integrations Connected"
        description="Connect third-party services to import emission data"
        icon={Link2}
        action={
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleConnectIntegration("googledrive")}>Connect Google Drive</Button>
            <Button onClick={() => handleConnectIntegration("xero")}>Connect Xero</Button>
          </div>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Connected Integrations</h2>
        <Button onClick={() => handleConnectIntegration("jotform")}>
          <Link2 className="mr-2 h-4 w-4" />
          Connect New Service
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {integrations.map((integration) => {
          const Icon = getIntegrationIcon(integration.type)
          return (
            <Card key={integration.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Icon className="mr-2 h-5 w-5" />
                    {integration.name}
                  </CardTitle>
                  <Badge variant={integration.status === "connected" ? "default" : "outline"}>
                    {integration.status}
                  </Badge>
                </div>
                <CardDescription>
                  {integration.last_sync_at
                    ? `Last synced: ${new Date(integration.last_sync_at).toLocaleString()}`
                    : "Not synced yet"}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Sync Now
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDisconnectIntegration(integration.id)}>
                    Disconnect
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

