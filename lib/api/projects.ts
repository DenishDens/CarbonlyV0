import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/types"
import { nanoid } from 'nanoid'

const supabase = createClient()

type Tables = Database["public"]["Tables"]
type Project = Tables["projects"]["Row"]
type ProjectInsert = Tables["projects"]["Insert"] 
type ProjectUpdate = Tables["projects"]["Update"]
type UserProfile = Tables["user_profiles"]["Row"]
type UserProfileColumn = keyof UserProfile

export async function fetchProjectsByUserId(userId: string): Promise<Project[]> {
  try {
    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("organization_id")
      .eq("user_id" satisfies UserProfileColumn, userId)
      .single()

    if (!userProfile?.organization_id) {
      console.error("No organization found for user")
      return []
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("organization_id", userProfile.organization_id)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error.message)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in fetchProjectsByUserId:", error)
    return []
  }
}

export async function fetchProjectById(projectId: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single()

    if (error) {
      console.error("Error fetching project:", error.message)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in fetchProjectById:", error)
    return null
  }
}

export async function fetchBusinessUnits(userId: string): Promise<Project[]> {
  try {
    const { data: userProfile } = await supabase
      .from("user_profiles")
      .select("organization_id")
      .eq("user_id" satisfies UserProfileColumn, userId)
      .single()

    if (!userProfile?.organization_id) {
      console.error("No organization found for user")
      return []
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("organization_id", userProfile.organization_id)
      .eq("project_type", "business_unit")
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching business units:", error.message)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in fetchBusinessUnits:", error)
    return []
  }
}

export async function fetchChildProjects(businessUnitId: string): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("parent_id", businessUnitId)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching child projects:", error.message)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in fetchChildProjects:", error)
    return []
  }
}

export async function createProject(
  userId: string,
  name: string,
  description: string,
  projectType: Project["project_type"] = "project",
  parentId: string | null = null,
  organizationId: string,
  location?: string,
  startDate?: string,
  endDate?: string,
  targetReduction?: number,
  isJointVenture: boolean = false
): Promise<Project | null> {
  try {
    // Generate a unique project code
    const prefix = projectType === "business_unit" ? "BU" : "PRJ";
    const code = `${prefix}-${nanoid(8).toUpperCase()}`;

    const newProject: ProjectInsert = {
      user_id: userId,
      name,
      description,
      code,
      status: "draft",
      progress: 0,
      project_type: projectType,
      parent_id: parentId,
      organization_id: organizationId,
      location,
      start_date: startDate,
      end_date: endDate,
      target_reduction: targetReduction,
      is_joint_venture: isJointVenture
    }

    const { data, error } = await supabase
      .from("projects")
      .insert(newProject)
      .select()
      .single()

    if (error) {
      console.error("Error creating project:", error.message)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in createProject:", error)
    return null
  }
}

export async function updateProject(projectId: string, updates: ProjectUpdate): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", projectId)
      .select()
      .single()

    if (error) {
      console.error("Error updating project:", error.message)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in updateProject:", error)
    return null
  }
}

export async function deleteProject(projectId: string): Promise<boolean> {
  try {
    // First, update any child projects to remove the parent reference
    const updateResult = await supabase
      .from("projects")
      .update({ parent_id: null })
      .eq("parent_id", projectId)

    if (updateResult.error) {
      console.error("Error updating child projects:", updateResult.error.message)
      return false
    }

    // Then delete the project
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId)

    if (error) {
      console.error("Error deleting project:", error.message)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteProject:", error)
    return false
  }
}
