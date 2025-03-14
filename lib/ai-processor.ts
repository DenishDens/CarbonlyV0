import type { FileType } from "@/types/emission-data"
import { createServerSupabaseClient } from "@/lib/supabase"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function processWithAI(
  fileData: Blob,
  fileType: FileType,
  fileId: string,
  projectId: string,
  organizationId: string,
) {
  const supabase = createServerSupabaseClient()

  // Get material library for matching
  const { data: materialLibrary } = await supabase.from("material_library").select("*")

  // Convert file to text or base64 for AI processing
  let fileContent
  if (fileType === "pdf" || fileType === "image") {
    // For PDFs and images, convert to base64
    const buffer = await fileData.arrayBuffer()
    fileContent = Buffer.from(buffer).toString("base64")
  } else {
    // For text files, convert to string
    fileContent = await fileData.text()
  }

  // Process with AI
  const prompt = `
    You are an expert in carbon emissions data extraction. Extract emission-related information from the following ${fileType} content.
    
    For each emission source identified, extract:
    1. Material name (e.g., Diesel, Electricity, Natural Gas)
    2. Amount and unit of measure (e.g., 100 liters, 500 kWh)
    3. Category if available (Scope 1, 2, or 3)
    4. Any other relevant metadata
    
    Format your response as a JSON array of objects with these fields:
    material_name, amount, unit_of_measure, category (if available), and metadata (any additional information).
    
    Here's the content:
    ${fileType === "txt" ? fileContent : "Base64 encoded file content (not shown for brevity)"}
  `

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      ...(fileType !== "txt" && {
        images: [fileContent],
      }),
    })

    // Parse the AI response
    const startJson = text.indexOf("[")
    const endJson = text.lastIndexOf("]") + 1

    if (startJson === -1 || endJson === 0) {
      throw new Error("AI response does not contain valid JSON")
    }

    const jsonStr = text.substring(startJson, endJson)
    const extractedData = JSON.parse(jsonStr)

    // Process each extracted item
    const records = []
    let matchedCount = 0
    let aiProcessedCount = 0
    const needsReviewCount = 0

    for (const item of extractedData) {
      const record: any = {
        id: crypto.randomUUID(),
        project_id: projectId,
        organization_id: organizationId,
        material_name: item.material_name,
        amount: Number.parseFloat(item.amount) || null,
        unit_of_measure: item.unit_of_measure,
        category: mapCategoryFromAI(item.category),
        source_file_id: fileId,
        source_type: "file_upload",
        processing_status: "completed",
        match_status: "ai_processed",
        confidence_score: 0.85, // Default confidence score for AI-processed items
        processed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: item.metadata || {},
      }

      // Try to match with material library
      let matched = false

      if (materialLibrary) {
        for (const material of materialLibrary) {
          // Check for exact name match or alias match
          if (
            material.name.toLowerCase() === item.material_name.toLowerCase() ||
            material.aliases?.some((alias) => alias.toLowerCase() === item.material_name.toLowerCase())
          ) {
            record.material_code = material.code
            record.material_name = material.name // Use standardized name
            record.category = material.category
            record.emission_factor = material.emission_factor

            if (record.amount) {
              record.total_emissions = record.amount * material.emission_factor
            }

            record.match_status = "matched"
            matched = true
            matchedCount++
            break
          }
        }
      }

      if (!matched) {
        aiProcessedCount++
      }

      records.push(record)
    }

    return {
      records,
      matchedCount,
      aiProcessedCount,
      needsReviewCount,
    }
  } catch (error) {
    console.error("Error processing with AI:", error)
    throw error
  }
}

function mapCategoryFromAI(category: string | undefined): string | undefined {
  if (!category) return undefined

  const lowerCategory = category.toLowerCase()

  if (lowerCategory.includes("scope 1") || lowerCategory.includes("scope1")) {
    return "scope_1"
  }

  if (lowerCategory.includes("scope 2") || lowerCategory.includes("scope2")) {
    return "scope_2"
  }

  if (lowerCategory.includes("scope 3") || lowerCategory.includes("scope3")) {
    return "scope_3"
  }

  return undefined
}

