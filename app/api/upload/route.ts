import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import type { FileType, DataSource } from "@/types/emission-data"
import { detectFileType } from "@/lib/file-utils"
import { queueFileForProcessing } from "@/lib/queue"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user and organization info
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("organization_id")
      .eq("id", session.user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const projectId = formData.get("projectId") as string
    const source = (formData.get("source") as DataSource) || "file_upload"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    // Detect file type
    const fileType = detectFileType(file.name) as FileType

    // Create a record in the uploaded_files table
    const fileId = uuidv4()
    const { error: uploadError } = await supabase.from("uploaded_files").insert({
      id: fileId,
      project_id: projectId,
      organization_id: userData.organization_id,
      file_name: file.name,
      file_type: fileType,
      file_size: file.size,
      upload_source: source,
      processing_status: "pending",
    })

    if (uploadError) {
      return NextResponse.json({ error: "Failed to record file upload" }, { status: 500 })
    }

    // Upload file to storage
    const fileBuffer = await file.arrayBuffer()
    const { error: storageError } = await supabase.storage
      .from("emission-data-uploads")
      .upload(`${userData.organization_id}/${projectId}/${fileId}`, fileBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (storageError) {
      return NextResponse.json({ error: "Failed to upload file to storage" }, { status: 500 })
    }

    // Queue the file for processing
    await queueFileForProcessing(fileId, fileType, projectId, userData.organization_id, source)

    // For structured files (CSV, Excel, JSON), return immediately for field mapping
    if (["csv", "excel", "json"].includes(fileType)) {
      return NextResponse.json({
        success: true,
        fileId,
        fileType,
        requiresMapping: true,
        message: "File uploaded successfully. Field mapping required.",
      })
    }

    // For unstructured files, they'll be processed asynchronously
    return NextResponse.json({
      success: true,
      fileId,
      fileType,
      requiresMapping: false,
      message: "File uploaded successfully and queued for processing.",
    })
  } catch (error) {
    console.error("Error in file upload:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

