import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { FileProcessor, type ProcessingOptions } from "@/lib/file-processing/file-processor"

export async function POST(request: NextRequest) {
  try {
    // Get the Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const organizationId = formData.get("organizationId") as string
    const projectId = formData.get("projectId") as string
    const mode = (formData.get("mode") as string) || "standard"
    const selectedSheet = formData.get("selectedSheet") as string

    // Validate required fields
    if (!file || !organizationId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user has access to this organization
    const { data: orgAccess, error: orgError } = await supabase
      .from("organization_members")
      .select("id")
      .eq("organization_id", organizationId)
      .eq("user_id", session.user.id)
      .limit(1)

    if (orgError || !orgAccess || orgAccess.length === 0) {
      return NextResponse.json({ error: "You do not have access to this organization" }, { status: 403 })
    }

    // Process the file
    const fileProcessor = new FileProcessor()

    const options: ProcessingOptions = {
      organizationId,
      projectId,
      mode: mode === "preview" ? "preview" : mode === "bulk" ? "bulk" : "standard",
      selectedSheet: selectedSheet || undefined,
      aiProcessingThreshold: 0.5,
    }

    const result = await fileProcessor.processFile(file, options)

    // Return the processing result
    return NextResponse.json(result)
  } catch (error) {
    console.error("API import error:", error)

    return NextResponse.json({ error: `An unexpected error occurred: ${(error as Error).message}` }, { status: 500 })
  }
}

