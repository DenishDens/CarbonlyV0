export type FileType = "csv" | "excel" | "json" | "pdf" | "image" | "txt"
export type DataSource = "file_upload" | "cloud_onedrive" | "xero" | "mobile_app" | "batch_import"
export type ProcessingStatus = "pending" | "processing" | "completed" | "failed" | "needs_review"
export type MaterialMatchStatus = "matched" | "ai_processed" | "needs_review" | "unmatched"
export type EmissionCategory = "scope_1" | "scope_2" | "scope_3"

export interface MaterialLibraryItem {
  id: string
  code: string
  name: string
  category: EmissionCategory
  unit_of_measure: string
  emission_factor: number
  keywords: string[] // For fuzzy matching
  aliases: string[] // Alternative names
}

export interface EmissionDataRecord {
  id: string
  project_id: string
  organization_id: string
  material_code?: string
  material_name?: string
  category?: EmissionCategory
  unit_of_measure?: string
  amount?: number
  emission_factor?: number
  total_emissions?: number
  source_file_id?: string
  source_file_name?: string
  source_type: DataSource
  processing_status: ProcessingStatus
  match_status: MaterialMatchStatus
  confidence_score?: number
  processed_at?: Date
  created_at: Date
  updated_at: Date
  metadata: Record<string, any> // Additional data specific to source
}

export interface UploadedFile {
  id: string
  project_id: string
  organization_id: string
  file_name: string
  file_type: FileType
  file_size: number
  upload_source: DataSource
  processing_status: ProcessingStatus
  record_count?: number
  matched_count?: number
  ai_processed_count?: number
  needs_review_count?: number
  created_at: Date
  updated_at: Date
}

export interface FieldMapping {
  source_field: string
  target_field: keyof EmissionDataRecord | null
  sample_value?: string
  is_matched?: boolean
}

export interface BulkImportSession {
  id: string
  file_id: string
  project_id: string
  organization_id: string
  field_mappings: FieldMapping[]
  total_records: number
  processed_records: number
  matched_records: number
  ai_processed_records: number
  needs_review_records: number
  status: ProcessingStatus
  created_at: Date
  updated_at: Date
}

