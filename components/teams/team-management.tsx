"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamMembers } from "./team-members"
import { PendingInvitations } from "./pending-invitations"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { InviteUserDialog } from "./invite-user-dialog"

interface TeamManagementProps {
  organizationId: string
  userId: string
}

export function TeamManagement({ organizationId, userId }: TeamManagementProps) {
  const [activeTab, setActiveTab] = useState("members")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-x-2 h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-[400px] bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="members" className="w-full" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="pending">Pending Invitations</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={() => setIsInviteDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      {activeTab === "members" ? (
        <TeamMembers organizationId={organizationId} userId={userId} />
      ) : (
        <PendingInvitations organizationId={organizationId} userId={userId} />
      )}

      <InviteUserDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        organizationId={organizationId}
      />
    </div>
  )
} 