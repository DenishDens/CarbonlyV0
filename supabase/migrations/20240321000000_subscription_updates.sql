-- Update subscription status enum
alter table public.subscriptions
drop constraint if exists subscriptions_status_check;

alter table public.subscriptions
add constraint subscriptions_status_check
check (status in ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired'));

-- Add new columns to subscription_plans
alter table public.subscription_plans
add column if not exists max_users integer not null default 5,
add column if not exists stripe_price_id text,
add column if not exists interval text not null default 'month' check (interval in ('month', 'year'));

-- Add Stripe-related columns to subscriptions
alter table public.subscriptions
add column if not exists stripe_subscription_id text,
add column if not exists stripe_customer_id text;

-- Create billing_history table
create table if not exists public.billing_history (
    id uuid primary key default uuid_generate_v4(),
    organization_id uuid not null references public.organizations(id) on delete cascade,
    subscription_id uuid not null references public.subscriptions(id) on delete cascade,
    amount numeric not null,
    currency text not null default 'USD',
    status text not null check (status in ('paid', 'pending', 'failed')),
    invoice_url text,
    billing_date timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone
);

-- Enable RLS for billing_history
alter table public.billing_history enable row level security;

-- Add billing history policies
create policy "Users can view billing history in their organization"
    on public.billing_history for select
    using (
        exists (
            select 1 from public.user_profiles
            where user_profiles.organization_id = billing_history.organization_id
            and user_profiles.user_id = auth.uid()
        )
    );

-- Add updated_at trigger for billing_history
create trigger handle_billing_history_updated_at
    before update on public.billing_history
    for each row
    execute function public.handle_updated_at();

-- Create function to get billing history
CREATE OR REPLACE FUNCTION public.get_billing_history(org_id uuid)
RETURNS TABLE (
    id uuid,
    organization_id uuid,
    subscription_id uuid,
    amount numeric,
    currency text,
    status text,
    invoice_url text,
    billing_date timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bh.id,
        bh.organization_id,
        bh.subscription_id,
        bh.amount,
        bh.currency,
        bh.status,
        bh.invoice_url,
        bh.billing_date,
        bh.created_at,
        bh.updated_at
    FROM public.billing_history bh
    WHERE bh.organization_id = org_id
    ORDER BY bh.billing_date DESC;
END;
$$;
