import { createClient } from "@supabase/supabase-js"

export async function createEmissionDataTables(supabaseUrl: string, supabaseKey: string) {
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Create material_library table
  const { error: materialLibraryError } = await supabase.rpc("create_material_library_table", {})
  if (materialLibraryError) console.error("Error creating material_library table:", materialLibraryError)

  // Create uploaded_files table
  const { error: uploadedFilesError } = await supabase.rpc("create_uploaded_files_table", {})
  if (uploadedFilesError) console.error("Error creating uploaded_files table:", uploadedFilesError)

  // Create emission_data_records table
  const { error: emissionDataError } = await supabase.rpc("create_emission_data_records_table", {})
  if (emissionDataError) console.error("Error creating emission_data_records table:", emissionDataError)

  // Create bulk_import_sessions table
  const { error: bulkImportError } = await supabase.rpc("create_bulk_import_sessions_table", {})
  if (bulkImportError) console.error("Error creating bulk_import_sessions table:", bulkImportError)
}

// SQL functions to be created in Supabase
/*
CREATE OR REPLACE FUNCTION create_material_library_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS material_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('scope_1', 'scope_2', 'scope_3')),
    unit_of_measure TEXT NOT NULL,
    emission_factor NUMERIC NOT NULL,
    keywords TEXT[] DEFAULT '{}',
    aliases TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  CREATE INDEX IF NOT EXISTS idx_material_library_code ON material_library(code);
  CREATE INDEX IF NOT EXISTS idx_material_library_name ON material_library(name);
  CREATE INDEX IF NOT EXISTS idx_material_library_keywords ON material_library USING GIN(keywords);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_uploaded_files_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS uploaded_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    upload_source TEXT NOT NULL,
    processing_status TEXT NOT NULL DEFAULT 'pending',
    record_count INTEGER,
    matched_count INTEGER DEFAULT 0,
    ai_processed_count INTEGER DEFAULT 0,
    needs_review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  CREATE INDEX IF NOT EXISTS idx_uploaded_files_project ON uploaded_files(project_id);
  CREATE INDEX IF NOT EXISTS idx_uploaded_files_organization ON uploaded_files(organization_id);
  CREATE INDEX IF NOT EXISTS idx_uploaded_files_status ON uploaded_files(processing_status);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_emission_data_records_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS emission_data_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    material_code TEXT,
    material_name TEXT,
    category TEXT CHECK (category IN ('scope_1', 'scope_2', 'scope_3')),
    unit_of_measure TEXT,
    amount NUMERIC,
    emission_factor NUMERIC,
    total_emissions NUMERIC,
    source_file_id UUID REFERENCES uploaded_files(id),
    source_file_name TEXT,
    source_type TEXT NOT NULL,
    processing_status TEXT NOT NULL DEFAULT 'pending',
    match_status TEXT NOT NULL DEFAULT 'unmatched',
    confidence_score NUMERIC,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
  );
  
  CREATE INDEX IF NOT EXISTS idx_emission_data_project ON emission_data_records(project_id);
  CREATE INDEX IF NOT EXISTS idx_emission_data_organization ON emission_data_records(organization_id);
  CREATE INDEX IF NOT EXISTS idx_emission_data_material ON emission_data_records(material_code);
  CREATE INDEX IF NOT EXISTS idx_emission_data_status ON emission_data_records(processing_status);
  CREATE INDEX IF NOT EXISTS idx_emission_data_match_status ON emission_data_records(match_status);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_bulk_import_sessions_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS bulk_import_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES uploaded_files(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    field_mappings JSONB NOT NULL DEFAULT '[]',
    total_records INTEGER NOT NULL DEFAULT 0,
    processed_records INTEGER NOT NULL DEFAULT 0,
    matched_records INTEGER NOT NULL DEFAULT 0,
    ai_processed_records INTEGER NOT NULL DEFAULT 0,
    needs_review_records INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  CREATE INDEX IF NOT EXISTS idx_bulk_import_file ON bulk_import_sessions(file_id);
  CREATE INDEX IF NOT EXISTS idx_bulk_import_project ON bulk_import_sessions(project_id);
  CREATE INDEX IF NOT EXISTS idx_bulk_import_status ON bulk_import_sessions(status);
END;
$$ LANGUAGE plpgsql;
*/

