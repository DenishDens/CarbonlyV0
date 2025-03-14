import { Database } from "@/lib/supabase/types"

type Tables = Database["public"]["Tables"]
type ProjectRow = Tables["projects"]["Row"]
type UserProfileRow = Tables["user_profiles"]["Row"]
type OrganizationRow = Tables["organizations"]["Row"]

export interface User {
  id: string
  email: string
  name: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type Organization = OrganizationRow

export type UserProfile = UserProfileRow

export type ProjectStatus = ProjectRow["status"]
export type ProjectType = ProjectRow["project_type"]
export type Project = ProjectRow
