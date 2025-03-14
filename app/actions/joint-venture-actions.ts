"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

export async function inviteJointVenturePartner(
  projectId: string,
  email: string,
  role: string,
  ownershipPercentage: number,
) {
  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Get project details
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*, organizations(*)")
      .eq("id", projectId)
      .single()

    if (projectError) {
      return { success: false, error: projectError.message }
    }

    // Check if email is associated with an organization
    const { data: userByEmail, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single()

    if (userError && userError.code !== "PGRST116") {
      // PGRST116 is "not found"
      return { success: false, error: userError.message }
    }

    if (!userByEmail) {
      // Create invitation for non-existing user
      const token = uuidv4()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // Expires in 7 days

      const { error: inviteError } = await supabase.from("invitations").insert({
        email,
        project_id: projectId,
        role,
        invited_by: user.id,
        token,
        expires_at: expiresAt.toISOString(),
      })

      if (inviteError) {
        return { success: false, error: inviteError.message }
      }

      // Send email notification (would be implemented with a proper email service)

      return { success: true }
    } else {
      // User exists, check if they belong to an organization
      const { data: orgUser, error: orgUserError } = await supabase
        .from("organization_users")
        .select("organization_id")
        .eq("user_id", userByEmail.id)
        .single()

      if (orgUserError && orgUserError.code !== "PGRST116") {
        return { success: false, error: orgUserError.message }
      }

      if (!orgUser) {
        return { success: false, error: "User exists but is not associated with an organization" }
      }

      // Add joint venture partner
      const { error: partnerError } = await supabase.from("joint_venture_partners").insert({
        project_id: projectId,
        organization_id: orgUser.organization_id,
        ownership_percentage: ownershipPercentage,
        role,
      })

      if (partnerError) {
        return { success: false, error: partnerError.message }
      }

      // Send notification (would be implemented with a proper notification service)

      revalidatePath(`/dashboard/projects/${projectId}`)
      return { success: true }
    }
  } catch (error) {
    console.error("Error inviting joint venture partner:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updatePartnerOwnership(partnerId: string, ownershipPercentage: number) {
  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Update partner ownership
    const { data: partner, error: updateError } = await supabase
      .from("joint_venture_partners")
      .update({ ownership_percentage: ownershipPercentage })
      .eq("id", partnerId)
      .select("project_id")
      .single()

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    revalidatePath(`/dashboard/projects/${partner.project_id}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating partner ownership:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function removeJointVenturePartner(partnerId: string) {
  try {
    const supabase = createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Get project ID before deletion for revalidation
    const { data: partner, error: getError } = await supabase
      .from("joint_venture_partners")
      .select("project_id")
      .eq("id", partnerId)
      .single()

    if (getError) {
      return { success: false, error: getError.message }
    }

    // Delete partner
    const { error: deleteError } = await supabase.from("joint_venture_partners").delete().eq("id", partnerId)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    revalidatePath(`/dashboard/projects/${partner.project_id}`)
    return { success: true }
  } catch (error) {
    console.error("Error removing joint venture partner:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

