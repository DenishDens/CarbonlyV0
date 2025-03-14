-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create organizations table
create table public.organizations (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone
);

-- Create user_profiles table
create table public.user_profiles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    organization_id uuid references public.organizations not null,
    role text check (role in ('owner', 'admin', 'member')) default 'member' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone,
    unique (user_id, organization_id)
);

-- Create projects table with total_emissions included
create table public.projects (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid references public.organizations not null,
    name text not null,
    description text,
    status text check (status in ('draft', 'in_progress', 'completed', 'archived')) default 'draft' not null,
    progress numeric check (progress >= 0 and progress <= 100) default 0 not null,
    project_type text check (project_type in ('business_unit', 'project')) default 'project' not null,
    parent_id uuid references public.projects,
    user_id uuid references auth.users not null,
    total_emissions numeric default 0 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone
);

-- Create materials table
create table public.materials (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    emission_factor numeric not null,
    unit_of_measurement text not null,
    category text not null,
    sub_category text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone
);

-- Create emission_data table
create table public.emission_data (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid references public.organizations not null,
    project_id uuid references public.projects not null,
    material_id uuid references public.materials not null,
    date date not null,
    quantity numeric not null,
    unit_of_measurement text not null,
    scope text check (scope in ('scope1', 'scope2', 'scope3')) not null,
    source text check (source in ('manual', 'file_upload', 'integration')) not null,
    source_file text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone
);

-- Create view for projects with total emissions by scope
create or replace view public.projects_with_emissions as
select
    p.*,
    o.name as organization_name,
    o.created_at as organization_created_at,
    o.updated_at as organization_updated_at,
    coalesce(sum(case when ed.scope = 'scope1' then ed.quantity * m.emission_factor else 0 end), 0) as scope1_emissions,
    coalesce(sum(case when ed.scope = 'scope2' then ed.quantity * m.emission_factor else 0 end), 0) as scope2_emissions,
    coalesce(sum(case when ed.scope = 'scope3' then ed.quantity * m.emission_factor else 0 end), 0) as scope3_emissions,
    coalesce(sum(ed.quantity * m.emission_factor), 0) as total_emissions
from
    public.projects p
    left join public.organizations o on p.organization_id = o.id
    left join public.emission_data ed on p.id = ed.project_id
    left join public.materials m on ed.material_id = m.id
group by
    p.id,
    o.id;

-- Create RLS policies

-- Organizations policies
alter table public.organizations enable row level security;

create policy "Organizations are viewable by organization members"
    on public.organizations for select
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = organizations.id
            and user_profiles.user_id = auth.uid()
        )
    );

create policy "Organizations are insertable by authenticated users"
    on public.organizations for insert
    with check (auth.role() = 'authenticated');

create policy "Organizations are updatable by organization admins"
    on public.organizations for update
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = organizations.id
            and user_profiles.user_id = auth.uid()
            and user_profiles.role in ('owner', 'admin')
        )
    );

-- User profiles policies
alter table public.user_profiles enable row level security;

create policy "User profiles are viewable by organization members"
    on public.user_profiles for select
    using (
        organization_id in (
            select organization_id from public.user_profiles
            where user_id = auth.uid()
        )
    );

create policy "Users can insert their own profile"
    on public.user_profiles for insert
    with check (auth.uid() = user_id);

create policy "Profile is updatable by organization admins"
    on public.user_profiles for update
    using (
        exists (
            select 1 from public.user_profiles profiles
            where profiles.organization_id = user_profiles.organization_id
            and profiles.user_id = auth.uid()
            and profiles.role in ('owner', 'admin')
        )
    );

-- Projects policies
alter table public.projects enable row level security;

create policy "Projects are viewable by organization members"
    on public.projects for select
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = projects.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

create policy "Projects are insertable by organization members"
    on public.projects for insert
    with check (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

create policy "Projects are updatable by organization members"
    on public.projects for update
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = projects.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

-- Projects with emissions view policy
alter view public.projects_with_emissions enable row level security;

create policy "Projects with emissions are viewable by organization members"
    on public.projects_with_emissions for select
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

-- Materials policies
alter table public.materials enable row level security;

create policy "Materials are viewable by organization members"
    on public.materials for select
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

-- Emission data policies
alter table public.emission_data enable row level security;

create policy "Emission data is viewable by organization members"
    on public.emission_data for select
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = emission_data.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

create policy "Emission data is insertable by organization members"
    on public.emission_data for insert
    with check (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

create policy "Emission data is updatable by organization members"
    on public.emission_data for update
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = emission_data.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

-- Create indexes for better performance
create index user_profiles_user_id_idx on public.user_profiles (user_id);
create index user_profiles_organization_id_idx on public.user_profiles (organization_id);
create index projects_organization_id_idx on public.projects (organization_id);
create index projects_user_id_idx on public.projects (user_id);
create index materials_category_idx on public.materials (category);
create index materials_sub_category_idx on public.materials (sub_category);
create index emission_data_project_id_idx on public.emission_data (project_id);
create index emission_data_material_id_idx on public.emission_data (material_id);
create index emission_data_date_idx on public.emission_data (date);
create index emission_data_scope_idx on public.emission_data (scope);

-- Create functions for handling timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql security definer;

-- Create triggers for updated_at columns
create trigger handle_updated_at
    before update on public.organizations
    for each row
    execute function public.handle_updated_at();

create trigger handle_updated_at
    before update on public.user_profiles
    for each row
    execute function public.handle_updated_at();

create trigger handle_updated_at
    before update on public.projects
    for each row
    execute function public.handle_updated_at();

create trigger handle_updated_at
    before update on public.materials
    for each row
    execute function public.handle_updated_at();

create trigger handle_updated_at
    before update on public.emission_data
    for each row
    execute function public.handle_updated_at(); 