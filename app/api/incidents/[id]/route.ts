import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"

const updateIncidentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  type_id: z.string().uuid().optional(),
  severity: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["open", "in_progress", "resolved"]).optional(),
  resolution_comment: z.string().optional(),
})

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const json = await req.json()
    const validated = updateIncidentSchema.parse(json)

    const updates: any = {
      ...validated,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    }

    // If status is being changed to resolved, add resolved_at and resolved_by
    if (validated.status === "resolved") {
      updates.resolved_at = new Date().toISOString()
      updates.resolved_by = user.id
    }

    const { data: incident, error } = await supabase
      .from("incidents")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error

    // Create audit log
    await supabase.from("incident_audit_logs").insert({
      incident_id: incident.id,
      action: "updated",
      details: validated,
      performed_by: user.id,
    })

    return NextResponse.json(incident)
  } catch (error) {
    console.error("Error updating incident:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: incident, error } = await supabase
      .from("incidents")
      .select(`
        *,
        business_units (name),
        projects (name),
        incident_types (name),
        created_by (name),
        updated_by (name),
        resolved_by (name)
      `)
      .eq("id", params.id)
      .single()

    if (error) throw error

    // Get audit logs
    const { data: auditLogs } = await supabase
      .from("incident_audit_logs")
      .select(`
        *,
        performed_by (name)
      `)
      .eq("incident_id", params.id)
      .order("performed_at", { ascending: false })

    return NextResponse.json({ incident, auditLogs })
  } catch (error) {
    console.error("Error fetching incident:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

