"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface PendingInvitation {
  id: string
  email: string
  role: string
  invited_by: string
  invited_by_email: string
  created_at: string
  expires_at: string
}

interface PendingInvitationsProps {
  organizationId: string
  userId: string
}

export function PendingInvitations({ organizationId, userId }: PendingInvitationsProps) {
  const [invitations, setInvitations] = useState<PendingInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchInvitations()
  }, [organizationId])

  async function fetchInvitations() {
    try {
      const { data, error } = await supabase
        .from("team_invitations")
        .select(`
          *,
          invited_by_profile:user_profiles!invited_by(email)
        `)
        .eq("organization_id", organizationId)
        .eq("status", "pending")
        .order("created_at", { ascending: false })

      if (error) throw error

      setInvitations(data.map(invitation => ({
        ...invitation,
        invited_by_email: invitation.invited_by_profile.email
      })))
    } catch (err) {
      console.error("Error fetching invitations:", err)
      setError("Failed to load invitations")
    } finally {
      setLoading(false)
    }
  }

  async function handleResend(invitationId: string) {
    try {
      const { error } = await supabase
        .rpc("resend_team_invitation", {
          invitation_id: invitationId
        })

      if (error) throw error

      // Show success message or update UI
    } catch (err) {
      console.error("Error resending invitation:", err)
      // Show error message
    }
  }

  async function handleCancel(invitationId: string) {
    try {
      const { error } = await supabase
        .from("team_invitations")
        .update({ status: "cancelled" })
        .eq("id", invitationId)

      if (error) throw error

      setInvitations(invitations.filter(inv => inv.id !== invitationId))
    } catch (err) {
      console.error("Error cancelling invitation:", err)
      // Show error message
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!invitations.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Mail className="mx-auto h-8 w-8 mb-2" />
          <p>No pending invitations</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {invitations.map((invitation) => (
        <Card key={invitation.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">{invitation.email}</span>
                  <span className="ml-2 text-sm text-muted-foreground">({invitation.role})</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-2" />
                  <span>
                    Invited by {invitation.invited_by_email} {formatDistanceToNow(new Date(invitation.created_at), { addSuffix: true })}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Expires {formatDistanceToNow(new Date(invitation.expires_at), { addSuffix: true })}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResend(invitation.id)}
                >
                  Resend
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancel(invitation.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 