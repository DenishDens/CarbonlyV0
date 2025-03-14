-- Insert test organizations
INSERT INTO public.organizations (id, name, created_at, updated_at)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Test Company 1', NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222222', 'Test Company 2', NOW(), NOW()),
    ('d0d0d0d0-0000-4000-a000-000000000000', 'Test Organization', NOW(), NOW());

-- Insert test users in auth schema
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'test1@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW()),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'test2@example.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW());

-- Insert test user profiles
INSERT INTO public.user_profiles (id, user_id, organization_id, full_name, role, created_at, updated_at)
VALUES
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Test User 1', 'admin', NOW(), NOW()),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Test User 2', 'member', NOW(), NOW()),
    ('auth-user-id', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd0d0d0d0-0000-4000-a000-000000000000', 'Test User 1', 'owner', NOW(), NOW());

-- Insert test projects
INSERT INTO public.projects (id, organization_id, name, description, status, progress, project_type, user_id, created_at, updated_at)
VALUES
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'Office Emissions', 'Tracking office building emissions', 'active', 0, 'business_unit', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW()),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-111111111111', 'Fleet Emissions', 'Tracking vehicle fleet emissions', 'active', 0, 'business_unit', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW()),
    ('11111111-2222-3333-4444-555555555555', '22222222-2222-2222-2222-222222222222', 'Factory Emissions', 'Tracking factory emissions', 'active', 0, 'business_unit', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW(), NOW()),
    ('p1d0d0d0-0000-4000-a000-000000000000', 'd0d0d0d0-0000-4000-a000-000000000000', 'Headquarters', 'Main office operations and facilities', 'in_progress', 0, 'business_unit', 'auth-user-id', NOW(), NOW()),
    ('p2d0d0d0-0000-4000-a000-000000000000', 'd0d0d0d0-0000-4000-a000-000000000000', 'Manufacturing Plant A', 'Primary manufacturing facility', 'in_progress', 0, 'business_unit', 'auth-user-id', NOW(), NOW()),
    ('p3d0d0d0-0000-4000-a000-000000000000', 'd0d0d0d0-0000-4000-a000-000000000000', 'Carbon Reduction Initiative', 'Company-wide initiative to reduce carbon emissions by 30% by 2025', 'in_progress', 25, 'project', 'auth-user-id', NOW(), NOW());

-- Insert test emissions data
INSERT INTO public.emissions (id, organization_id, project_id, date, total, scope1, scope2, scope3, created_at, updated_at)
VALUES
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '2024-03-01', 100.5, 30.5, 40.0, 30.0, NOW(), NOW()),
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '2024-03-02', 95.0, 25.0, 40.0, 30.0, NOW(), NOW()),
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '2024-03-01', 150.0, 100.0, 30.0, 20.0, NOW(), NOW()),
    (uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', '11111111-2222-3333-4444-555555555555', '2024-03-01', 500.0, 300.0, 150.0, 50.0, NOW(), NOW()),
    (uuid_generate_v4(), 'd0d0d0d0-0000-4000-a000-000000000000', 'p1d0d0d0-0000-4000-a000-000000000000', '2024-03-01', 150.5, 50.2, 60.1, 40.2, NOW(), NOW()),
    (uuid_generate_v4(), 'd0d0d0d0-0000-4000-a000-000000000000', 'p2d0d0d0-0000-4000-a000-000000000000', '2024-03-01', 320.8, 120.3, 150.2, 50.3, NOW(), NOW()),
    (uuid_generate_v4(), 'd0d0d0d0-0000-4000-a000-000000000000', 'p3d0d0d0-0000-4000-a000-000000000000', '2024-03-01', 0, 0, 0, 0, NOW(), NOW());

-- Insert test joint ventures
INSERT INTO public.joint_ventures (id, organization_id, name, description, status, partner_organization_id, start_date, created_at, updated_at)
VALUES
    ('22222222-3333-4444-5555-666666666666', '11111111-1111-1111-1111-111111111111', 'Green Initiative', 'Joint sustainability project', 'active', '22222222-2222-2222-2222-222222222222', '2024-01-01', NOW(), NOW());

-- Insert test joint venture emissions
INSERT INTO public.joint_venture_emissions (id, joint_venture_id, organization_id, project_id, date, total, scope1, scope2, scope3, created_at, updated_at)
VALUES
    (uuid_generate_v4(), '22222222-3333-4444-5555-666666666666', '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '2024-03-01', 75.0, 25.0, 25.0, 25.0, NOW(), NOW());

-- Insert test reports
INSERT INTO public.reports (id, organization_id, project_id, name, description, type, start_date, end_date, status, data, created_at, updated_at)
VALUES
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'March 2024 Report', 'Monthly emissions report', 'monthly', '2024-03-01', '2024-04-01', 'completed', '{"total_emissions": 195.5, "reduction_percentage": 5.5}'::jsonb, NOW(), NOW());

-- Insert test file imports
INSERT INTO public.file_imports (id, organization_id, project_id, file_name, file_type, file_size, status, processed_at, created_at, updated_at)
VALUES
    (uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'march_data.csv', 'csv', 1024, 'completed', NOW(), NOW(), NOW()); 