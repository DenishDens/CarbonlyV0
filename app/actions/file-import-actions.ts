"use server"

import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface ImportRecord {
  materialId: string
  materialName: string
  category: string
  quantity: number
  standardQuantity: number
  standardUnit: string
  emissionFactor: number
  date?: string
  supplier?: string
  notes?: string
  matchConfidence?: number
  aiProcessed?: boolean
}

export async function saveImportedRecords(organizationId: string, projectId: string, records: ImportRecord[]) {
  try {
    const session = await auth()

    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    // Check if user has access to this organization
    const { data: orgAccess, error: orgError } = await supabase
      .from("organization_members")
      .select("id")
      .eq("organization_id", organizationId)
      .eq("user_id", session.user.id)
      .limit(1)

    if (orgError || !orgAccess || orgAccess.length === 0) {
      return { success: false, error: "You do not have access to this organization" }
    }

    // Check if project exists and belongs to the organization
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("organization_id", organizationId)
      .limit(1)

    if (projectError || !projectData || projectData.length === 0) {
      return { success: false, error: "Project not found or does not belong to this organization" }
    }

    // Prepare records for insertion
    const emissionRecords = records.map((record) => ({
      project_id: projectId,
      organization_id: organizationId,
      material_id: record.materialId,
      material_name: record.materialName,
      category: record.category,
      quantity: record.quantity,
      standard_quantity: record.standardQuantity,
      standard_unit: record.standardUnit,
      emission_factor: record.emissionFactor,
      emission_date: record.date || new Date().toISOString().split("T")[0],
      supplier: record.supplier || null,
      notes: record.notes || null,
      confidence: record.matchConfidence || 1.0,
      ai_processed: record.aiProcessed || false,
      created_by: session.user.id,
      created_at: new Date().toISOString(),
    }))

    // Insert records into the database
    const { data, error } = await supabase.from("emission_data").insert(emissionRecords).select("id")

    if (error) {
      console.error("Error saving imported records:", error)
      return { success: false, error: "Failed to save records" }
    }

    // Revalidate the dashboard and project pages
    revalidatePath(`/dashboard`)
    revalidatePath(`/projects/${projectId}`)

    return {
      success: true,
      count: data.length,
      message: `Successfully imported ${data.length} records`,
    }
  } catch (error) {
    console.error("Import action error:", error)
    return {
      success: false,
      error: `An unexpected error occurred: ${(error as Error).message}`,
    }
  }
}

export async function saveReviewedRecords(organizationId: string, projectId: string, records: ImportRecord[]) {
  // Similar to saveImportedRecords but for records that needed review
  // and have been manually approved by the user
  return await saveImportedRecords(organizationId, projectId, records)
}

export async function createMaterialFromImport(
  organizationId: string,
  material: {
    name: string
    category: string
    standardUnit: string
    emissionFactor: number
    aliases?: string[]
  },
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    // Check if user has access to this organization
    const { data: orgAccess, error: orgError } = await supabase
      .from("organization_members")
      .select("id, role")
      .eq("organization_id", organizationId)
      .eq("user_id", session.user.id)
      .limit(1)

    if (orgError || !orgAccess || orgAccess.length === 0) {
      return { success: false, error: "You do not have access to this organization" }
    }

    // Only admins can create materials
    if (orgAccess[0].role !== "admin" && orgAccess[0].role !== "owner") {
      return { success: false, error: "Only admins can create materials" }
    }

    // Check if material already exists
    const { data: existingMaterial, error: existingError } = await supabase
      .from("material_library")
      .select("id")
      .eq("name", material.name)
      .eq("organization_id", organizationId)
      .limit(1)

    if (existingMaterial && existingMaterial.length > 0) {
      return { success: false, error: "Material already exists" }
    }

    // Create the material
    const { data, error } = await supabase
      .from("material_library")
      .insert({
        organization_id: organizationId,
        name: material.name,
        category: material.category,
        standard_unit: material.standardUnit,
        emission_factor: material.emissionFactor,
        aliases: material.aliases || [],
        created_by: session.user.id,
      })
      .select("id")

    if (error) {
      console.error("Error creating material:", error)
      return { success: false, error: "Failed to create material" }
    }

    return {
      success: true,
      materialId: data[0].id,
      message: `Successfully created material: ${material.name}`,
    }
  } catch (error) {
    console.error("Create material error:", error)
    return {
      success: false,
      error: `An unexpected error occurred: ${(error as Error).message}`,
    }
  }
}

