import { Database } from "@/lib/supabase/types"

type Tables = Database["public"]["Tables"]

export type IncidentSeverity = "low" | "medium" | "high"
export type IncidentStatus = "open" | "in_progress" | "resolved"

export type IncidentType = Tables["incident_types"]["Row"]
export type Incident = Tables["incidents"]["Row"]

export interface IncidentAuditLog {
  id: string
  incident_id: number
  action: string
  details: Record<string, any>
  performed_at: string
  performed_by?: string
}

export interface CreateIncidentInput {
  title: string
  description?: string | null
  business_unit_id?: string | null
  project_id?: string | null
  type_id: string
  severity: IncidentSeverity
  organization_id: string
}

export interface UpdateIncidentInput {
  title?: string
  description?: string | null
  type_id?: string
  severity?: IncidentSeverity
  status?: IncidentStatus
  resolution_comment?: string | null
}
