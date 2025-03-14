-- Additional RLS policies for file_imports
create policy "Users can update their file imports"
    on public.file_imports for update
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = file_imports.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

create policy "Users can delete their file imports"
    on public.file_imports for delete
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = file_imports.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

-- Additional RLS policies for reports
create policy "Users can update their reports"
    on public.reports for update
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = reports.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

create policy "Users can delete their reports"
    on public.reports for delete
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = reports.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

-- Additional RLS policies for joint_ventures
create policy "Users can update their joint ventures"
    on public.joint_ventures for update
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = joint_ventures.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

create policy "Users can delete their joint ventures"
    on public.joint_ventures for delete
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = joint_ventures.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

-- Additional RLS policies for joint_venture_emissions
create policy "Users can update joint venture emissions"
    on public.joint_venture_emissions for update
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = joint_venture_emissions.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

create policy "Users can delete joint venture emissions"
    on public.joint_venture_emissions for delete
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = joint_venture_emissions.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

-- Additional indexes for better performance
create index if not exists idx_file_imports_created_at on public.file_imports(created_at);
create index if not exists idx_file_imports_processed_at on public.file_imports(processed_at);
create index if not exists idx_file_imports_organization_status on public.file_imports(organization_id, status);

create index if not exists idx_reports_created_at on public.reports(created_at);
create index if not exists idx_reports_organization_type on public.reports(organization_id, type);
create index if not exists idx_reports_organization_status on public.reports(organization_id, status);
create index if not exists idx_reports_date_range on public.reports(start_date, end_date);

create index if not exists idx_joint_ventures_created_at on public.joint_ventures(created_at);
create index if not exists idx_joint_ventures_organization_status on public.joint_ventures(organization_id, status);
create index if not exists idx_joint_ventures_date_range on public.joint_ventures(start_date, end_date);
create index if not exists idx_joint_ventures_partner on public.joint_ventures(partner_organization_id);

create index if not exists idx_joint_venture_emissions_created_at on public.joint_venture_emissions(created_at);
create index if not exists idx_joint_venture_emissions_organization_date on public.joint_venture_emissions(organization_id, date);
create index if not exists idx_joint_venture_emissions_joint_venture_date on public.joint_venture_emissions(joint_venture_id, date);

-- Additional validation constraints
alter table public.file_imports
    add constraint valid_file_size check (file_size > 0),
    add constraint valid_file_type check (file_type in ('csv', 'xlsx', 'pdf', 'doc', 'docx')),
    add constraint valid_processed_at check (processed_at is null or processed_at >= created_at);

alter table public.reports
    add constraint valid_report_type_dates check (
        (type = 'monthly' and extract(day from end_date) = extract(day from start_date) and extract(month from end_date) > extract(month from start_date)) or
        (type = 'quarterly' and extract(month from end_date) - extract(month from start_date) in (3, 6, 9)) or
        (type = 'annual' and extract(year from end_date) > extract(year from start_date)) or
        (type = 'custom' and end_date >= start_date)
    ),
    add constraint valid_report_status check (
        (status = 'draft' and data = '{}'::jsonb) or
        (status in ('generating', 'completed', 'archived') and data != '{}'::jsonb)
    );

alter table public.joint_ventures
    add constraint valid_partner_organization check (partner_organization_id != organization_id),
    add constraint valid_jv_status check (
        (status = 'pending' and end_date is null) or
        (status = 'active' and end_date is null) or
        (status = 'inactive' and end_date is not null)
    );

-- Create function to validate organization membership
create or replace function public.validate_organization_membership(
    p_user_id uuid,
    p_organization_id uuid
)
returns boolean as $$
begin
    return exists (
        select 1 from public.user_profiles
        where user_profiles.user_id = p_user_id
        and user_profiles.organization_id = p_organization_id
    );
end;
$$ language plpgsql security definer;

-- Create function to validate project ownership
create or replace function public.validate_project_ownership(
    p_organization_id uuid,
    p_project_id uuid
)
returns boolean as $$
begin
    return exists (
        select 1 from public.projects
        where projects.id = p_project_id
        and projects.organization_id = p_organization_id
    );
end;
$$ language plpgsql security definer;

-- Create function to validate joint venture partnership
create or replace function public.validate_joint_venture_partnership(
    p_organization_id uuid,
    p_joint_venture_id uuid
)
returns boolean as $$
begin
    return exists (
        select 1 from public.joint_ventures
        where joint_ventures.id = p_joint_venture_id
        and (
            joint_ventures.organization_id = p_organization_id
            or joint_ventures.partner_organization_id = p_organization_id
        )
    );
end;
$$ language plpgsql security definer; 