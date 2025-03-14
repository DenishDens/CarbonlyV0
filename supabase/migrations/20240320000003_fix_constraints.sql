-- Drop the problematic check constraint
alter table public.joint_venture_emissions
    drop constraint if exists valid_emission_dates;

-- Create a function to validate emission dates
create or replace function public.validate_emission_dates()
returns trigger as $$
begin
    if not exists (
        select 1 from public.joint_ventures
        where joint_ventures.id = new.joint_venture_id
        and joint_ventures.start_date <= new.date
        and (joint_ventures.end_date is null or joint_ventures.end_date >= new.date)
    ) then
        raise exception 'Emission date must be within the joint venture period';
    end if;
    return new;
end;
$$ language plpgsql;

-- Create trigger for emission dates validation
create trigger validate_emission_dates_trigger
    before insert or update on public.joint_venture_emissions
    for each row
    execute function public.validate_emission_dates(); 