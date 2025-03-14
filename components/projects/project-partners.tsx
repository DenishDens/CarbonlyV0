"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { PlusCircle } from "lucide-react"

type Partner = {
  id: string
  name: string
  email: string
  organization: string
  role: "viewer" | "editor" | "admin"
  status: "active" | "pending" | "declined"
  avatarUrl?: string
}

export function ProjectPartners({ project, isOwner }: { project: any; isOwner: boolean }) {
  // Sample partners data - in a real app, this would come from the project or a separate query
  const partners = [
    { id: 1, name: "Acme Corp", role: "Supplier", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "EcoTech", role: "Consultant", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 3, name: "Green Energy", role: "Service Provider", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "viewer" as "viewer" | "editor" | "admin",
  })
  const [isLoading, setIsLoading] = useState(false)

  if (!project) {
    return <div>Project not found</div>
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newPartner: Partner = {
        id: `new-${Date.now()}`,
        name: inviteForm.email.split("@")[0],
        email: inviteForm.email,
        organization: "Pending",
        role: inviteForm.role,
        status: "pending",
      }

      // setPartners([...partners, newPartner]) // This line is removed as partners are now static
      setInviteForm({ email: "", role: "viewer" })
      setIsInviteDialogOpen(false)
      toast.success(`Invitation sent to ${inviteForm.email}`)
    } catch (error) {
      toast.error("Failed to send invitation")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendInvite = (partnerId: string) => {
    const partner = partners.find((p) => p.id === partnerId)
    if (partner) {
      toast.success(`Invitation resent to ${partner.email}`)
    }
  }

  const handleRemovePartner = (partnerId: string) => {
    // setPartners(partners.filter((p) => p.id !== partnerId)) // This line is removed as partners are now static
    toast.success("Partner removed successfully")
  }

  const handleRoleChange = (partnerId: string, newRole: "viewer" | "editor" | "admin") => {
    // setPartners(partners.map((p) => (p.id === partnerId ? { ...p, role: newRole } : p))) // This line is removed as partners are now static
    toast.success("Partner role updated")
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Project Partners</CardTitle>
          <CardDescription>Organizations collaborating on this project</CardDescription>
        </div>
        {isOwner && (
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Partner
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {partners.map((partner) => (
            <div key={partner.id} className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={partner.avatar} alt={partner.name} />
                  <AvatarFallback>{partner.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{partner.name}</h4>
                  <p className="text-sm text-muted-foreground">{partner.role}</p>
                </div>
              </div>
              {isOwner && (
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              )}
            </div>
          ))}

          {partners.length === 0 && (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">No partners yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectPartners

