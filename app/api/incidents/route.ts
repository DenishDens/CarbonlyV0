import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"

const createIncidentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  business_unit_id: z.string().uuid().optional(),
  project_id: z.string().uuid().optional(),
  type_id: z.string().uuid(),
  severity: z.enum(["low", "medium", "high"]),
})

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const json = await req.json()
    const validated = createIncidentSchema.parse(json)

    const { data: incident, error } = await supabase
      .from("incidents")
      .insert({
        ...validated,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    // Create audit log
    await supabase.from("incident_audit_logs").insert({
      incident_id: incident.id,
      action: "created",
      details: validated,
      performed_by: user.id,
    })

    return NextResponse.json(incident)
  } catch (error) {
    console.error("Error creating incident:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(req.url)

    const query = supabase.from("incidents").select(`
        *,
        business_units (name),
        projects (name),
        incident_types (name)
      `)

    // Apply filters
    const status = searchParams.get("status")
    if (status) {
      query.eq("status", status)
    }

    const businessUnitId = searchParams.get("business_unit_id")
    if (businessUnitId) {
      query.eq("business_unit_id", businessUnitId)
    }

    const projectId = searchParams.get("project_id")
    if (projectId) {
      query.eq("project_id", projectId)
    }

    const search = searchParams.get("search")
    if (search) {
      query.ilike("title", `%${search}%`)
    }

    const { data, error } = await query.order("id", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching incidents:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

