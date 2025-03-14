import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import type { FileType } from "@/types/emission-data"
import { processWithAI } from "@/lib/ai-processor"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    // Check authentication via API key or token
    // This would be implemented based on your mobile app authentication strategy

    const body = await request.json()
    const {
      file_name,
      file_type,
      upload_source = "mobile_app",
      data, // Base64 encoded file data
      project_id,
      organization_id,
    } = body

    if (!file_name || !file_type || !data || !project_id || !organization_id) {
      return NextResponse.json(
        {
          error: "Missing required fields: file_name, file_type, data, project_id, organization_id",
        },
        { status: 400 },
      )
    }

    // Create a record in the uploaded_files table
    const fileId = uuidv4()
    const { error: uploadError } = await supabase.from("uploaded_files").insert({
      id: fileId,
      project_id,
      organization_id,
      file_name,
      file_type,
      file_size: Math.ceil(data.length * 0.75), // Approximate size from base64
      upload_source,
      processing_status: "processing",
    })

    if (uploadError) {
      return NextResponse.json({ error: "Failed to record file upload" }, { status: 500 })
    }

    // Convert base64 to blob
    const byteCharacters = atob(data)
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024)

      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }

    const blob = new Blob(byteArrays)

    // Upload file to storage
    const { error: storageError } = await supabase.storage
      .from("emission-data-uploads")
      .upload(`${organization_id}/${project_id}/${fileId}`, blob, {
        contentType: `${file_type === "image" ? "image/jpeg" : "application/octet-stream"}`,
        upsert: false,
      })

    if (storageError) {
      return NextResponse.json({ error: "Failed to upload file to storage" }, { status: 500 })
    }

    // Process with AI immediately for mobile uploads
    const result = await processWithAI(blob, file_type as FileType, fileId, project_id, organization_id)

    // Update file status
    await supabase
      .from("uploaded_files")
      .update({
        processing_status: "completed",
        record_count: result.records.length,
        matched_count: result.matchedCount,
        ai_processed_count: result.aiProcessedCount,
        needs_review_count: result.needsReviewCount,
      })
      .eq("id", fileId)

    // Insert the processed records
    if (result.records.length > 0) {
      await supabase.from("emission_data_records").insert(result.records)
    }

    // Return the processed data
    return NextResponse.json({
      success: true,
      fileId,
      records: result.records.map((record) => ({
        material_code: record.material_code,
        material_name: record.material_name,
        category: record.category,
        unit_of_measure: record.unit_of_measure,
        amount: record.amount,
        emission_factor: record.emission_factor,
        total_emissions: record.total_emissions,
        confidence: record.confidence_score,
      })),
    })
  } catch (error) {
    console.error("Error in mobile upload:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

