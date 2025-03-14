-- Enable Row Level Security on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE emission_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE emission_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- Create a function to check if a user is a super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM users WHERE id = user_id;
  RETURN user_role = 'super_admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if a user belongs to an organization
CREATE OR REPLACE FUNCTION is_organization_member(user_id UUID, org_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_org_id UUID;
BEGIN
  SELECT organization_id INTO user_org_id FROM users WHERE id = user_id;
  RETURN user_org_id = org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if a user has access to a project
CREATE OR REPLACE FUNCTION has_project_access(user_id UUID, proj_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_org_id UUID;
  project_org_id UUID;
  is_partner BOOLEAN;
BEGIN
  -- Get user's organization
  SELECT organization_id INTO user_org_id FROM users WHERE id = user_id;
  
  -- Get project's organization
  SELECT organization_id INTO project_org_id FROM projects WHERE id = proj_id;
  
  -- Check if user's organization is the project owner
  IF user_org_id = project_org_id THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user's organization is a partner in the project
  SELECT EXISTS (
    SELECT 1 FROM project_partners 
    WHERE project_id = proj_id 
    AND partner_organization_id = user_org_id
    AND status = 'accepted'
  ) INTO is_partner;
  
  RETURN is_partner;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Organizations Policies
CREATE POLICY organizations_select_policy ON organizations
  FOR SELECT USING (
    is_super_admin(auth.uid()) OR 
    organization_id = id OR
    EXISTS (
      SELECT 1 FROM project_partners
      JOIN projects ON project_partners.project_id = projects.id
      WHERE projects.organization_id = organizations.id
      AND project_partners.partner_organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
      AND project_partners.status = 'accepted'
    )
  );

CREATE POLICY organizations_insert_policy ON organizations
  FOR INSERT WITH CHECK (
    is_super_admin(auth.uid()) OR 
    owner_id = auth.uid()
  );

CREATE POLICY organizations_update_policy ON organizations
  FOR UPDATE USING (
    is_super_admin(auth.uid()) OR 
    owner_id = auth.uid()
  );

CREATE POLICY organizations_delete_policy ON organizations
  FOR DELETE USING (
    is_super_admin(auth.uid()) OR 
    owner_id = auth.uid()
  );

-- Users Policies
CREATE POLICY users_select_policy ON users
  FOR SELECT USING (
    is_super_admin(auth.uid()) OR 
    id = auth.uid() OR
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM project_partners
      JOIN projects ON project_partners.project_id = projects.id
      WHERE projects.organization_id = (SELECT organization_id FROM users WHERE id = users.id)
      AND project_partners.partner_organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
      AND project_partners.status = 'accepted'
    )
  );

CREATE POLICY users_insert_policy ON users
  FOR INSERT WITH CHECK (
    is_super_admin(auth.uid()) OR 
    id = auth.uid() OR
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin' AND
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY users_update_policy ON users
  FOR UPDATE USING (
    is_super_admin(auth.uid()) OR 
    id = auth.uid() OR
    ((SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'owner') AND
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()))
  );

CREATE POLICY users_delete_policy ON users
  FOR DELETE USING (
    is_super_admin(auth.uid()) OR 
    ((SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'owner') AND
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()))
  );

-- Projects Policies
CREATE POLICY projects_select_policy ON projects
  FOR SELECT USING (
    is_super_admin(auth.uid()) OR 
    has_project_access(auth.uid(), id)
  );

CREATE POLICY projects_insert_policy ON projects
  FOR INSERT WITH CHECK (
    is_super_admin(auth.uid()) OR 
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY projects_update_policy ON projects
  FOR UPDATE USING (
    is_super_admin(auth.uid()) OR 
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY projects_delete_policy ON projects
  FOR DELETE USING (
    is_super_admin(auth.uid()) OR 
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
  );

-- Project Partners Policies
CREATE POLICY project_partners_select_policy ON project_partners
  FOR SELECT USING (
    is_super_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND has_project_access(auth.uid(), id))
  );

CREATE POLICY project_partners_insert_policy ON project_partners
  FOR INSERT WITH CHECK (
    is_super_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()))
  );

CREATE POLICY project_partners_update_policy ON project_partners
  FOR UPDATE USING (
    is_super_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())) OR
    (partner_organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()) AND status = 'pending')
  );

CREATE POLICY project_partners_delete_policy ON project_partners
  FOR DELETE USING (
    is_super_admin(auth.uid()) OR 
    EXISTS (SELECT 1 FROM projects WHERE id = project_id AND organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()))
  );

-- Emission Data Policies
CREATE POLICY emission_data_select_policy ON emission_data
  FOR SELECT USING (
    is_super_admin(auth.uid()) OR 
    has_project_access(auth.uid(), project_id)
  );

CREATE POLICY emission_data_insert_policy ON emission_data
  FOR INSERT WITH CHECK (
    is_super_admin(auth.uid()) OR 
    has_project_access(auth.uid(), project_id)
  );

CREATE POLICY emission_data_update_policy ON emission_data
  FOR UPDATE USING (
    is_super_admin(auth.uid()) OR 
    has_project_access(auth.uid(), project_id)
  );

CREATE POLICY emission_data_delete_policy ON emission_data
  FOR DELETE USING (
    is_super_admin(auth.uid()) OR 
    has_project_access(auth.uid(), project_id)
  );

-- Emission Factors Policies (public read, admin write)
CREATE POLICY emission_factors_select_policy ON emission_factors
  FOR SELECT USING (true);

CREATE POLICY emission_factors_insert_policy ON emission_factors
  FOR INSERT WITH CHECK (
    is_super_admin(auth.uid())
  );

CREATE POLICY emission_factors_update_policy ON emission_factors
  FOR UPDATE USING (
    is_super_admin(auth.uid())
  );

CREATE POLICY emission_factors_delete_policy ON emission_factors
  FOR DELETE USING (
    is_super_admin(auth.uid())
  );

-- Integrations Policies
CREATE POLICY integrations_select_policy ON integrations
  FOR SELECT USING (
    is_super_admin(auth.uid()) OR 
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY integrations_insert_policy ON integrations
  FOR INSERT WITH CHECK (
    is_super_admin(auth.uid()) OR 
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY integrations_update_policy ON integrations
  FOR UPDATE USING (
    is_super_admin(auth.uid()) OR 
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY integrations_delete_policy ON integrations
  FOR DELETE USING (
    is_super_admin(auth.uid()) OR 
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
  );

-- AI Conversations Policies
CREATE POLICY ai_conversations_select_policy ON ai_conversations
  FOR SELECT USING (
    is_super_admin(auth.uid()) OR 
    user_id = auth.uid()
  );

CREATE POLICY ai_conversations_insert_policy ON ai_conversations
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    (project_id IS NULL OR has_project_access(auth.uid(), project_id))
  );

CREATE POLICY ai_conversations_update_policy ON ai_conversations
  FOR UPDATE USING (
    user_id = auth.uid()
  );

CREATE POLICY ai_conversations_delete_policy ON ai_conversations
  FOR DELETE USING (
    user_id = auth.uid()
  );

