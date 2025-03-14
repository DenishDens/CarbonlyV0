import { createServerSupabaseClient } from "@/lib/supabase"
import type { FileType, DataSource } from "@/types/emission-data"
import { parseStructuredFile } from "@/lib/file-utils"
import { processWithAI } from "@/lib/ai-processor"

export async function queueFileForProcessing(
  fileId: string,
  fileType: FileType,
  projectId: string,
  organizationId: string,
  source: DataSource,
) {
  const supabase = createServerSupabaseClient()

  // Update status to processing
  await supabase.from("uploaded_files").update({ processing_status: "processing" }).eq("id", fileId)

  // For unstructured files (PDF, images), process with AI directly
  if (["pdf", "image", "txt"].includes(fileType)) {
    try {
      // Get file from storage
      const { data: fileData, error: fileError } = await supabase.storage
        .from("emission-data-uploads")
        .download(`${organizationId}/${projectId}/${fileId}`)

      if (fileError) throw new Error(`Failed to download file: ${fileError.message}`)

      // Process with AI
      const result = await processWithAI(fileData, fileType, fileId, projectId, organizationId)

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
    } catch (error) {
      console.error("Error processing file with AI:", error)

      // Update file status to failed
      await supabase
        .from("uploaded_files")
        .update({
          processing_status: "failed",
        })
        .eq("id", fileId)
    }
  }

  // For structured files (CSV, Excel, JSON), we'll wait for field mapping
  // before processing, so we just update the status to indicate it's ready for mapping
  if (["csv", "excel", "json"].includes(fileType)) {
    await supabase.from("uploaded_files").update({ processing_status: "needs_review" }).eq("id", fileId)
  }
}

export async function processBulkImport(importSessionId: string) {
  const supabase = createServerSupabaseClient()

  // Get the import session
  const { data: session, error: sessionError } = await supabase
    .from("bulk_import_sessions")
    .select("*, uploaded_files(*)")
    .eq("id", importSessionId)
    .single()

  if (sessionError || !session) {
    console.error("Error fetching import session:", sessionError)
    return
  }

  // Update session status to processing
  await supabase.from("bulk_import_sessions").update({ status: "processing" }).eq("id", importSessionId)

  try {
    // Get file from storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from("emission-data-uploads")
      .download(`${session.organization_id}/${session.project_id}/${session.file_id}`)

    if (fileError) throw new Error(`Failed to download file: ${fileError.message}`)

    // Parse the file
    const parsedData = await parseStructuredFile(
      await fileData.arrayBuffer(),
      session.uploaded_files.file_type as FileType,
    )

    if (parsedData.error) throw new Error(parsedData.error)

    // Process each record according to field mappings
    const fieldMappings = session.field_mappings as any[]
    const records = []
    let matchedCount = 0
    let aiProcessedCount = 0
    let needsReviewCount = 0

    // Get material library for matching
    const { data: materialLibrary } = await supabase.from("material_library").select("*")

    const materialMap = new Map()
    materialLibrary?.forEach((material) => {
      materialMap.set(material.code.toLowerCase(), material)
      materialMap.set(material.name.toLowerCase(), material)
      material.aliases?.forEach((alias) => materialMap.set(alias.toLowerCase(), material))
    })

    // Process each row
    for (const row of parsedData.data) {
      const record: any = {
        id: crypto.randomUUID(),
        project_id: session.project_id,
        organization_id: session.organization_id,
        source_file_id: session.file_id,
        source_file_name: session.uploaded_files.file_name,
        source_type: session.uploaded_files.upload_source,
        processing_status: "pending",
        match_status: "unmatched",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: {},
      }

      // Apply field mappings
      let materialNameField = null
      let materialCodeField = null

      fieldMappings.forEach((mapping) => {
        if (!mapping.target_field || !mapping.source_field) return

        const value = row[mapping.source_field]
        if (value === undefined) return

        record[mapping.target_field] = value

        // Track material name and code fields for matching
        if (mapping.target_field === "material_name") materialNameField = value
        if (mapping.target_field === "material_code") materialCodeField = value
      })

      // Try to match with material library
      let matched = false

      // Try exact match by code first
      if (materialCodeField && materialMap.has(materialCodeField.toLowerCase())) {
        const material = materialMap.get(materialCodeField.toLowerCase())
        record.material_code = material.code
        record.material_name = material.name
        record.category = material.category
        record.unit_of_measure = material.unit_of_measure
        record.emission_factor = material.emission_factor

        if (record.amount) {
          record.total_emissions = record.amount * material.emission_factor
        }

        record.match_status = "matched"
        record.processing_status = "completed"
        record.processed_at = new Date().toISOString()
        matched = true
        matchedCount++
      }
      // Try match by name
      else if (materialNameField && materialMap.has(materialNameField.toLowerCase())) {
        const material = materialMap.get(materialNameField.toLowerCase())
        record.material_code = material.code
        record.material_name = material.name
        record.category = material.category
        record.unit_of_measure = material.unit_of_measure
        record.emission_factor = material.emission_factor

        if (record.amount) {
          record.total_emissions = record.amount * material.emission_factor
        }

        record.match_status = "matched"
        record.processing_status = "completed"
        record.processed_at = new Date().toISOString()
        matched = true
        matchedCount++
      }

      // If not matched, queue for AI processing or mark for review
      if (!matched) {
        // If we have enough information, send to AI
        if (materialNameField || materialCodeField) {
          record.match_status = "ai_processed"
          record.processing_status = "processing"
          aiProcessedCount++

          // In a real implementation, we would queue this for AI processing
          // For now, we'll just mark it as needing review
          record.match_status = "needs_review"
          record.processing_status = "needs_review"
          needsReviewCount++
        } else {
          record.match_status = "needs_review"
          record.processing_status = "needs_review"
          needsReviewCount++
        }
      }

      records.push(record)
    }

    // Insert all records
    if (records.length > 0) {
      const { error: insertError } = await supabase.from("emission_data_records").insert(records)

      if (insertError) throw new Error(`Failed to insert records: ${insertError.message}`)
    }

    // Update session status
    await supabase
      .from("bulk_import_sessions")
      .update({
        status: "completed",
        processed_records: records.length,
        matched_records: matchedCount,
        ai_processed_records: aiProcessedCount,
        needs_review_records: needsReviewCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", importSessionId)

    // Update file status
    await supabase
      .from("uploaded_files")
      .update({
        processing_status: "completed",
        record_count: records.length,
        matched_count: matchedCount,
        ai_processed_count: aiProcessedCount,
        needs_review_count: needsReviewCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.file_id)
  } catch (error) {
    console.error("Error processing bulk import:", error)

    // Update session status to failed
    await supabase
      .from("bulk_import_sessions")
      .update({
        status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", importSessionId)

    // Update file status to failed
    await supabase
      .from("uploaded_files")
      .update({
        processing_status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.file_id)
  }
}

