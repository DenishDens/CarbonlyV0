"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "../ui/empty-state"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import type { Database } from "@/types/supabase"
import { Users, UserPlus, Percent, Building } from "lucide-react"
import { InvitePartnerDialog } from "./invite-partner-dialog"

interface JointVenturePartnersProps {
  projectId: string
}

type Project = Database["public"]["Tables"]["projects"]["Row"]
type Partner = Database["public"]["Tables"]["joint_venture_partners"]["Row"] & {
  organizations: Database["public"]["Tables"]["organizations"]["Row"]
}

export function JointVenturePartners({ projectId }: JointVenturePartnersProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchProjectAndPartners() {
      try {
        // Get project details
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .single()

        if (projectError) throw projectError
        setProject(projectData)

        // Get partners if it's a joint venture
        if (projectData.is_joint_venture) {
          const { data: partnersData, error: partnersError } = await supabase
            .from("joint_venture_partners")
            .select(`
              *,
              organizations(*)
            `)
            .eq("project_id", projectId)

          if (partnersError) throw partnersError
          setPartners(partnersData as Partner[])
        }
      } catch (error) {
        console.error("Error fetching project data:", error)
        toast({
          title: "Error",
          description: "Failed to load project data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProjectAndPartners()
  }, [projectId])

  const handleInvitePartner = async (email: string, role: string, ownershipPercentage: number) => {
    try {
      // This would call the server action to invite a partner
      // For now, we'll simulate adding a partner
      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${email}`,
      })

      setInviteDialogOpen(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive",
      })
    }
  }

  const handleRemovePartner = async (partnerId: string) => {
    try {
      const { error } = await supabase.from("joint_venture_partners").delete().eq("id", partnerId)

      if (error) throw error

      setPartners(partners.filter((p) => p.id !== partnerId))

      toast({
        title: "Partner Removed",
        description: "Partner has been removed from the project",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove partner",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading joint venture data...</div>
  }

  if (!project) {
    return <div>Project not found</div>
  }

  if (!project.is_joint_venture) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Joint Venture</CardTitle>
          <CardDescription>This project is not configured as a joint venture</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            To enable joint venture functionality, edit the project settings and enable the joint venture option.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild>
            <a href={`/dashboard/projects/${projectId}/edit`}>Edit Project Settings</a>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (partners.length === 0) {
    return (
      <EmptyState
        title="No Partners Added"
        description="Invite organizations to collaborate on this joint venture project"
        icon={Users}
        action={
          <Button onClick={() => setInviteDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Partner
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Joint Venture Partners</h2>
        <Button onClick={() => setInviteDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Partner
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {partners.map((partner) => (
          <Card key={partner.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  {partner.organizations.name}
                </CardTitle>
                <Badge variant={partner.status === "active" ? "default" : "outline"}>{partner.status}</Badge>
              </div>
              <CardDescription>Role: {partner.role}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center">
                <Percent className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{partner.ownership_percentage}%</span>
                <span className="ml-2 text-sm text-muted-foreground">ownership</span>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit Ownership
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleRemovePartner(partner.id)}>
                  Remove
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <InvitePartnerDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} onInvite={handleInvitePartner} />
    </div>
  )
}

