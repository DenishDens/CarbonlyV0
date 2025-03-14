-- Create file_imports table
create table if not exists public.file_imports (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    project_id uuid not null references public.projects(id) on delete cascade,
    file_name text not null,
    file_type text not null,
    file_size integer not null,
    status text not null check (status in ('pending', 'processing', 'completed', 'failed')) default 'pending',
    error_message text,
    processed_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone
);

-- Create reports table
create table if not exists public.reports (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    project_id uuid not null references public.projects(id) on delete cascade,
    name text not null,
    description text,
    type text not null check (type in ('monthly', 'quarterly', 'annual', 'custom')),
    start_date date not null,
    end_date date not null,
    status text not null check (status in ('draft', 'generating', 'completed', 'archived')) default 'draft',
    data jsonb not null default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone,
    constraint valid_report_dates check (end_date >= start_date)
);

-- Create joint_ventures table
create table if not exists public.joint_ventures (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    name text not null,
    description text,
    status text not null check (status in ('active', 'inactive', 'pending')) default 'pending',
    partner_organization_id uuid references public.organizations(id),
    start_date date not null,
    end_date date,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone,
    constraint valid_jv_dates check (end_date is null or end_date >= start_date)
);

-- Create joint_venture_emissions table (for tracking emissions in joint ventures)
create table if not exists public.joint_venture_emissions (
    id uuid primary key default uuid_generate_v4(),
    joint_venture_id uuid not null references public.joint_ventures(id) on delete cascade,
    organization_id uuid not null references public.organizations(id) on delete cascade,
    project_id uuid not null references public.projects(id) on delete cascade,
    date date not null,
    total numeric not null check (total >= 0),
    scope1 numeric not null check (scope1 >= 0),
    scope2 numeric not null check (scope2 >= 0),
    scope3 numeric not null check (scope3 >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone,
    constraint valid_scopes check (total = scope1 + scope2 + scope3)
);

-- Enable RLS for new tables
alter table public.file_imports enable row level security;
alter table public.reports enable row level security;
alter table public.joint_ventures enable row level security;
alter table public.joint_venture_emissions enable row level security;

-- File imports policies
create policy "Users can view file imports in their organization"
    on public.file_imports for select
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = file_imports.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

create policy "Users can create file imports in their organization"
    on public.file_imports for insert
    with check (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = file_imports.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

-- Reports policies
create policy "Users can view reports in their organization"
    on public.reports for select
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = reports.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

create policy "Users can create reports in their organization"
    on public.reports for insert
    with check (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = reports.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

-- Joint ventures policies
create policy "Users can view joint ventures in their organization"
    on public.joint_ventures for select
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = joint_ventures.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

create policy "Users can create joint ventures in their organization"
    on public.joint_ventures for insert
    with check (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = joint_ventures.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

-- Joint venture emissions policies
create policy "Users can view joint venture emissions"
    on public.joint_venture_emissions for select
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = joint_venture_emissions.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

-- Create indexes for better performance
create index if not exists idx_file_imports_organization_id on public.file_imports(organization_id);
create index if not exists idx_file_imports_project_id on public.file_imports(project_id);
create index if not exists idx_file_imports_status on public.file_imports(status);

create index if not exists idx_reports_organization_id on public.reports(organization_id);
create index if not exists idx_reports_project_id on public.reports(project_id);
create index if not exists idx_reports_type on public.reports(type);
create index if not exists idx_reports_status on public.reports(status);

create index if not exists idx_joint_ventures_organization_id on public.joint_ventures(organization_id);
create index if not exists idx_joint_ventures_status on public.joint_ventures(status);

create index if not exists idx_joint_venture_emissions_joint_venture_id on public.joint_venture_emissions(joint_venture_id);
create index if not exists idx_joint_venture_emissions_organization_id on public.joint_venture_emissions(organization_id);
create index if not exists idx_joint_venture_emissions_project_id on public.joint_venture_emissions(project_id);
create index if not exists idx_joint_venture_emissions_date on public.joint_venture_emissions(date);

-- Create triggers for updated_at on new tables
create trigger handle_file_imports_updated_at
    before update on public.file_imports
    for each row
    execute function public.handle_updated_at();

create trigger handle_reports_updated_at
    before update on public.reports
    for each row
    execute function public.handle_updated_at();

create trigger handle_joint_ventures_updated_at
    before update on public.joint_ventures
    for each row
    execute function public.handle_updated_at();

create trigger handle_joint_venture_emissions_updated_at
    before update on public.joint_venture_emissions
    for each row
    execute function public.handle_updated_at(); 