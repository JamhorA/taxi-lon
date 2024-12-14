-- Create a function to initialize the database
create or replace function initialize_database()
returns void
language plpgsql
security definer
as $$
begin
  -- Create tables if they don't exist
  create table if not exists "Companies" (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    org_nr text not null unique,
    created_at timestamp with time zone default now()
  );

  create table if not exists "Cars" (
    id uuid primary key default uuid_generate_v4(),
    company_id uuid not null references "Companies" (id) on delete cascade,
    reg_nr text not null unique,
    drosknr integer not null unique,
    model text,
    created_at timestamp with time zone default now()
  );

  create table if not exists "Drivers" (
    id uuid primary key default uuid_generate_v4(),
    company_id uuid not null references "Companies" (id) on delete cascade,
    name text not null,
    driver_id text not null unique,
    created_at timestamp with time zone default now()
  );

  create table if not exists "Shifts" (
    id uuid primary key default uuid_generate_v4(),
    car_id uuid not null references "Cars" (id) on delete cascade,
    driver_id uuid not null references "Drivers" (id) on delete cascade,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone not null,
    taxi_km decimal,
    paid_km decimal,
    trips integer,
    report_nr text not null,
    bom_avbest decimal,
    total_income decimal,
    cash decimal,
    to_report decimal,
    total_credit decimal,
    created_at timestamp with time zone default now()
  );

  create table if not exists "VAT_Details" (
    id uuid primary key default uuid_generate_v4(),
    shift_id uuid not null references "Shifts" (id) on delete cascade,
    vat_rate decimal not null,
    gross_income decimal,
    net_income decimal,
    vat_amount decimal
  );

  create table if not exists "User_Roles" (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users (id) on delete cascade,
    role text not null check (role in ('admin', 'user')),
    company_id uuid references "Companies" (id) on delete cascade,
    created_at timestamp with time zone default now()
  );

  -- Enable RLS
  alter table "Companies" enable row level security;
  alter table "Cars" enable row level security;
  alter table "Drivers" enable row level security;
  alter table "Shifts" enable row level security;
  alter table "VAT_Details" enable row level security;
  alter table "User_Roles" enable row level security;

  -- Create or replace policies
  drop policy if exists "companies_select_policy" on "Companies";
  create policy "companies_select_policy" on "Companies"
    for select using (
      exists (
        select 1 from "User_Roles"
        where "User_Roles".user_id = auth.uid()
        and "User_Roles".company_id = "Companies".id
      )
    );

  drop policy if exists "companies_insert_policy" on "Companies";
  create policy "companies_insert_policy" on "Companies"
    for insert with check (
      not exists (
        select 1 from "User_Roles"
        where "User_Roles".user_id = auth.uid()
      )
      or exists (
        select 1 from "User_Roles"
        where "User_Roles".user_id = auth.uid()
        and "User_Roles".role = 'admin'
      )
    );

  -- Add other policies as needed...
end;
$$;