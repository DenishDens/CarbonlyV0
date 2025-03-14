-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create organizations table
create table if not exists public.organizations (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone
);

-- Create subscription_plans table
create table if not exists public.subscription_plans (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    price numeric not null,
    interval text not null check (interval in ('month', 'year')),
    features jsonb not null default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone
);

-- Create subscriptions table
create table if not exists public.subscriptions (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    plan_id uuid not null references public.subscription_plans(id),
    status text not null check (status in ('active', 'canceled', 'incomplete', 'past_due')),
    current_period_start timestamp with time zone not null,
    current_period_end timestamp with time zone not null,
    cancel_at_period_end boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone,
    constraint valid_period check (current_period_end > current_period_start)
);

-- Create user_profiles table
create table if not exists public.user_profiles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    organization_id uuid not null references public.organizations(id) on delete cascade,
    full_name text not null,
    role text not null check (role in ('admin', 'member')) default 'member',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone,
    unique(user_id)
);

-- Create projects table
create table if not exists public.projects (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    name text not null,
    description text,
    status text not null check (status in ('active', 'archived')) default 'active',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone
);

-- Create incident_types table
create table if not exists public.incident_types (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone
);

-- Create incidents table
create table if not exists public.incidents (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    project_id uuid not null references public.projects(id) on delete cascade,
    type_id uuid not null references public.incident_types(id),
    title text not null,
    description text,
    status text not null check (status in ('open', 'in_progress', 'resolved')) default 'open',
    priority text not null check (priority in ('low', 'medium', 'high')) default 'medium',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone
);

-- Create emissions table
create table if not exists public.emissions (
    id uuid primary key default uuid_generate_v4(),
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

-- Create RLS policies
alter table public.organizations enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.user_profiles enable row level security;
alter table public.projects enable row level security;
alter table public.incident_types enable row level security;
alter table public.incidents enable row level security;
alter table public.emissions enable row level security;

-- Organizations policies
create policy "Users can view their organization"
    on public.organizations for select
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = organizations.id
            and user_profiles.user_id = auth.uid()
        )
    );

-- User profiles policies
create policy "Users can view their own profile"
    on public.user_profiles for select
    using (user_id = auth.uid());

create policy "Users can update their own profile"
    on public.user_profiles for update
    using (user_id = auth.uid());

-- Projects policies
create policy "Users can view projects in their organization"
    on public.projects for select
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = projects.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

-- Incidents policies
create policy "Users can view incidents in their organization"
    on public.incidents for select
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = incidents.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

-- Emissions policies
create policy "Users can view emissions in their organization"
    on public.emissions for select
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = emissions.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

-- Create functions for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_organizations_updated_at
    before update on public.organizations
    for each row
    execute function public.handle_updated_at();

create trigger handle_subscription_plans_updated_at
    before update on public.subscription_plans
    for each row
    execute function public.handle_updated_at();

create trigger handle_subscriptions_updated_at
    before update on public.subscriptions
    for each row
    execute function public.handle_updated_at();

create trigger handle_user_profiles_updated_at
    before update on public.user_profiles
    for each row
    execute function public.handle_updated_at();

create trigger handle_projects_updated_at
    before update on public.projects
    for each row
    execute function public.handle_updated_at();

create trigger handle_incident_types_updated_at
    before update on public.incident_types
    for each row
    execute function public.handle_updated_at();

create trigger handle_incidents_updated_at
    before update on public.incidents
    for each row
    execute function public.handle_updated_at();

create trigger handle_emissions_updated_at
    before update on public.emissions
    for each row
    execute function public.handle_updated_at(); 