"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Database } from "@/types/supabase"

type TeamMember = Database["public"]["Tables"]["user_profiles"]["Row"]

interface TeamMembersProps {
  organizationId: string
  userId: string
}

export function TeamMembers({ organizationId, userId }: TeamMembersProps) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchMembers()
  }, [organizationId])

  async function fetchMembers() {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("user_profiles")
        .select(`
          id,
          user_id,
          organization_id,
          role,
          is_super_admin,
          created_at,
          updated_at
        `)
        .eq("organization_id", organizationId)
        .order("role", { ascending: false })

      if (profilesError) throw profilesError
      setMembers(profiles || [])
    } catch (err) {
      console.error("Error fetching team members:", err)
      setError("Failed to load team members")
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateRole(memberId: string, newRole: "admin" | "member") {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ role: newRole })
        .eq("id", memberId)

      if (error) throw error

      setMembers(members.map(member => 
        member.id === memberId ? { ...member, role: newRole } : member
      ))

      toast.success("Role updated successfully")
    } catch (err) {
      console.error("Error updating role:", err)
      toast.error("Failed to update role")
    }
  }

  async function handleRemoveMember(memberId: string) {
    try {
      // Delete the member's profile
      const { error } = await supabase
        .from("user_profiles")
        .delete()
        .eq("id", memberId)

      if (error) throw error

      setMembers(members.filter(member => member.id !== memberId))
      toast.success("Member removed successfully")
    } catch (err) {
      console.error("Error removing member:", err)
      toast.error("Failed to remove member")
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!members.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <User className="mx-auto h-8 w-8 mb-2" />
          <p>No team members found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <Card key={member.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">User ID: {member.user_id}</div>
                  <div className="text-sm text-muted-foreground capitalize">{member.role}</div>
                </div>
              </div>
              {member.user_id !== userId && !member.is_super_admin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {member.role}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "admin")}>
                      Make Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateRole(member.id, "member")}>
                      Make Member
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Remove from Team
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 