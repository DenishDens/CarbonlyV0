import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get search query if any
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")
    const category = searchParams.get("category")
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    let materialQuery = supabase.from("material_library").select("*").limit(limit)

    if (query) {
      materialQuery = materialQuery.or(`name.ilike.%${query}%,code.ilike.%${query}%`)
    }

    if (category) {
      materialQuery = materialQuery.eq("category", category)
    }

    const { data: materials, error } = await materialQuery

    if (error) {
      return NextResponse.json({ error: "Failed to fetch material library" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      materials,
    })
  } catch (error) {
    console.error("Error fetching material library:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Check authentication and admin rights
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has admin rights
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single()

    if (userError || !userData || userData.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin rights required" }, { status: 403 })
    }

    const body = await request.json()
    const { code, name, category, unit_of_measure, emission_factor, keywords = [], aliases = [] } = body

    if (!code || !name || !category || !unit_of_measure || emission_factor === undefined) {
      return NextResponse.json(
        {
          error: "Missing required fields: code, name, category, unit_of_measure, emission_factor",
        },
        { status: 400 },
      )
    }

    // Add new material to library
    const { data, error } = await supabase
      .from("material_library")
      .insert({
        code,
        name,
        category,
        unit_of_measure,
        emission_factor,
        keywords,
        aliases,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to add material to library" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      material: data,
    })
  } catch (error) {
    console.error("Error adding material to library:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

