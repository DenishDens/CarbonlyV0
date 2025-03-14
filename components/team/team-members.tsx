"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, UserPlus } from "lucide-react"
import { InviteTeamMember } from "./invite-team-member"

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatarUrl?: string
  status: "active" | "pending" | "inactive"
}

interface TeamMembersProps {
  members: TeamMember[]
  currentUserId: string
  isOwner: boolean
}

export function TeamMembers({ members, currentUserId, isOwner }: TeamMembersProps) {
  const router = useRouter()
  const [showInviteDialog, setShowInviteDialog] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "owner":
        return "bg-blue-100 text-blue-800"
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "member":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "inactive":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    // Implementation would go here
    alert(`Remove member ${memberId}`)
    router.refresh()
  }

  const handleChangeMemberRole = async (memberId: string, newRole: string) => {
    // Implementation would go here
    alert(`Change role of member ${memberId} to ${newRole}`)
    router.refresh()
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your team members and their roles.</CardDescription>
          </div>
          {isOwner && (
            <Button onClick={() => setShowInviteDialog(true)} className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              <span>Invite</span>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {member.name}
                      {member.id === currentUserId && <span className="ml-2 text-xs text-muted-foreground">(You)</span>}
                    </div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getStatusColor(member.status) }} />
                    <span className={`rounded-full px-2 py-1 text-xs ${getRoleColor(member.role)}`}>{member.role}</span>
                  </div>
                  {isOwner && member.id !== currentUserId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleChangeMemberRole(member.id, "admin")}>
                          Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeMemberRole(member.id, "member")}>
                          Make Member
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleRemoveMember(member.id)}>
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showInviteDialog && (
        <InviteTeamMember
          open={showInviteDialog}
          onOpenChange={setShowInviteDialog}
          onInviteSent={() => {
            setShowInviteDialog(false)
            router.refresh()
          }}
        />
      )}
    </>
  )
}

