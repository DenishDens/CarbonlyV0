import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { parseStructuredFile, extractSampleValues } from "@/lib/file-utils"
import type { FileType, FieldMapping } from "@/types/emission-data"
import { processBulkImport } from "@/lib/bulk-import" // Import the missing function

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

    // Get file ID from query params
    const searchParams = request.nextUrl.searchParams
    const fileId = searchParams.get("fileId")

    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 })
    }

    // Get file info
    const { data: fileData, error: fileError } = await supabase
      .from("uploaded_files")
      .select("*")
      .eq("id", fileId)
      .single()

    if (fileError || !fileData) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Get file from storage
    const { data: fileContent, error: storageError } = await supabase.storage
      .from("emission-data-uploads")
      .download(`${fileData.organization_id}/${fileData.project_id}/${fileId}`)

    if (storageError) {
      return NextResponse.json({ error: "Failed to download file" }, { status: 500 })
    }

    // Parse the file
    const parsedData = await parseStructuredFile(await fileContent.arrayBuffer(), fileData.file_type as FileType)

    if (parsedData.error) {
      return NextResponse.json({ error: parsedData.error }, { status: 500 })
    }

    // Extract sample values for each column
    const sampleValues = extractSampleValues(parsedData.data)

    // Get material library fields for suggestions
    const targetFields = [
      { field: "material_code", label: "Material Code" },
      { field: "material_name", label: "Material Name" },
      { field: "category", label: "Category (Scope 1, 2, 3)" },
      { field: "unit_of_measure", label: "Unit of Measure" },
      { field: "amount", label: "Amount/Quantity" },
      { field: "emission_factor", label: "Emission Factor" },
    ]

    // Generate suggested mappings based on header names
    const suggestedMappings: FieldMapping[] = parsedData.headers.map((header) => {
      const lowerHeader = header.toLowerCase()
      let suggestedField = null

      // Simple mapping logic based on common field names
      if (lowerHeader.includes("code") || lowerHeader.includes("id")) {
        suggestedField = "material_code"
      } else if (
        lowerHeader.includes("material") ||
        lowerHeader.includes("item") ||
        lowerHeader.includes("product") ||
        lowerHeader.includes("fuel")
      ) {
        suggestedField = "material_name"
      } else if (lowerHeader.includes("category") || lowerHeader.includes("scope") || lowerHeader.includes("type")) {
        suggestedField = "category"
      } else if (lowerHeader.includes("unit") || lowerHeader.includes("uom") || lowerHeader.includes("measure")) {
        suggestedField = "unit_of_measure"
      } else if (
        lowerHeader.includes("amount") ||
        lowerHeader.includes("quantity") ||
        lowerHeader.includes("qty") ||
        lowerHeader.includes("volume") ||
        lowerHeader.includes("weight")
      ) {
        suggestedField = "amount"
      } else if (
        lowerHeader.includes("factor") ||
        lowerHeader.includes("emission factor") ||
        lowerHeader.includes("co2")
      ) {
        suggestedField = "emission_factor"
      }

      return {
        source_field: header,
        target_field: suggestedField,
        sample_value: sampleValues[header]?.[0] || "",
        is_matched: !!suggestedField,
      }
    })

    return NextResponse.json({
      success: true,
      fileId,
      headers: parsedData.headers,
      rowCount: parsedData.rowCount,
      sampleValues,
      targetFields,
      suggestedMappings,
    })
  } catch (error) {
    console.error("Error generating field mappings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    const body = await request.json()
    const { fileId, mappings } = body

    if (!fileId || !mappings) {
      return NextResponse.json({ error: "File ID and mappings are required" }, { status: 400 })
    }

    // Get file info
    const { data: fileData, error: fileError } = await supabase
      .from("uploaded_files")
      .select("*")
      .eq("id", fileId)
      .single()

    if (fileError || !fileData) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Create a bulk import session
    const importSessionId = crypto.randomUUID()
    const { error: sessionError } = await supabase.from("bulk_import_sessions").insert({
      id: importSessionId,
      file_id: fileId,
      project_id: fileData.project_id,
      organization_id: fileData.organization_id,
      field_mappings: mappings,
      total_records: fileData.record_count || 0,
      status: "pending",
    })

    if (sessionError) {
      return NextResponse.json({ error: "Failed to create import session" }, { status: 500 })
    }

    // Queue the bulk import for processing
    await processBulkImport(importSessionId)

    return NextResponse.json({
      success: true,
      importSessionId,
      message: "Field mappings saved and processing started",
    })
  } catch (error) {
    console.error("Error saving field mappings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

