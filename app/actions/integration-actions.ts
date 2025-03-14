"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function connectIntegration(
  organizationId: string,
  projectId: string | null,
  integrationType: string,
  config: any = {},
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

    // Check if integration already exists
    const { data: existingIntegration, error: checkError } = await supabase
      .from("integrations")
      .select("id, status")
      .eq("organization_id", organizationId)
      .eq("type", integrationType)
      .eq("project_id", projectId || null)
      .maybeSingle()

    if (checkError) {
      return { success: false, error: checkError.message }
    }

    if (existingIntegration) {
      // Update existing integration
      const { error: updateError } = await supabase
        .from("integrations")
        .update({
          status: existingIntegration.status === "connected" ? "disconnected" : "connected",
          config: existingIntegration.status === "connected" ? {} : config,
          last_sync_at: existingIntegration.status === "connected" ? null : new Date().toISOString(),
        })
        .eq("id", existingIntegration.id)

      if (updateError) {
        return { success: false, error: updateError.message }
      }
    } else {
      // Create new integration
      const { error: insertError } = await supabase.from("integrations").insert({
        organization_id: organizationId,
        project_id: projectId,
        type: integrationType,
        name: getIntegrationName(integrationType),
        status: "connected",
        config,
        last_sync_at: new Date().toISOString(),
      })

      if (insertError) {
        return { success: false, error: insertError.message }
      }
    }

    if (projectId) {
      revalidatePath(`/dashboard/projects/${projectId}`)
    } else {
      revalidatePath(`/dashboard/settings/integrations`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error connecting integration:", error)
    return { success: false, error: "An unexpected error occurred" }
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

