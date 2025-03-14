"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserPlus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Database } from "@/lib/supabase/types"
import { User } from "@supabase/supabase-js"

type Tables = Database["public"]["Tables"]
type UserProfile = Tables["user_profiles"]["Row"]
type UserProfileColumn = keyof UserProfile

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar_url: string | null
}

interface UserMetadata {
  name?: string
  avatar_url?: string | null
  role?: string
}

interface UserData extends User {
  user_metadata: UserMetadata
}

export default function TeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadTeamMembers()
  }, [])

  const loadTeamMembers = async () => {
    try {
      const { data: userProfile } = await supabase.auth.getUser()
      
      if (!userProfile?.user?.id) {
        console.error("No authenticated user found")
        return
      }

      // Get the user's organization ID
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("organization_id")
        .eq("user_id" satisfies UserProfileColumn, userProfile.user.id)
        .single()

      if (!profile?.organization_id) {
        console.error("No organization found for user")
        return
      }

      // Get all users in the same organization
      const { data: teamMembers, error } = await supabase
        .from("user_profiles")
        .select("user_id")
        .eq("organization_id", profile.organization_id)

      if (error || !teamMembers) {
        console.error("Error loading team members:", error)
        return
      }

      // Get user data for each team member
      const userIds = teamMembers.map(member => member.user_id)
      const { data: users } = await supabase.auth.admin.listUsers()

      if (!users) {
        console.error("Error loading user data")
        return
      }

      const formattedMembers = users.users
        .filter(user => userIds.includes(user.id))
        .map(user => ({
          id: user.id,
          name: user.user_metadata?.name || user.email?.split("@")[0] || "Unknown",
          email: user.email || "",
          role: user.user_metadata?.role || "Viewer",
          avatar_url: user.user_metadata?.avatar_url || null
        }))

      setMembers(formattedMembers)
    } catch (error) {
      console.error("Error in loadTeamMembers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Admin</Badge>
      case "editor":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Editor</Badge>
      case "viewer":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Viewer</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Viewer</Badge>
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Loading team members...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage team members and their access permissions</CardDescription>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={member.avatar_url || ""} alt={member.name} />
                <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500">{member.email}</p>
              </div>
              <div className="flex items-center">
                {getRoleBadge(member.role)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
