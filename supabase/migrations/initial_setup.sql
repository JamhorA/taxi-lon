-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Drop existing tables if they exist
drop table if exists "VAT_Details" cascade;
drop table if exists "Shifts" cascade;
drop table if exists "Drivers" cascade;
drop table if exists "Cars" cascade;
drop table if exists "User_Roles" cascade;
drop table if exists "Companies" cascade;

-- Create Companies table
create table "Companies" (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    org_nr text not null unique,
    created_at timestamp with time zone default now()
);

-- Create Cars table
create table "Cars" (
    id uuid primary key default uuid_generate_v4(),
    company_id uuid not null references "Companies" (id) on delete cascade,
    reg_nr text not null unique,
    drosknr integer not null unique,
    model text,
    created_at timestamp with time zone default now()
);

-- Create Drivers table
create table "Drivers" (
    id uuid primary key default uuid_generate_v4(),
    company_id uuid not null references "Companies" (id) on delete cascade,
    name text not null,
    driver_id text not null unique,
    created_at timestamp with time zone default now()
);

-- Create Shifts table
create table "Shifts" (
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

-- Create VAT_Details table
create table "VAT_Details" (
    id uuid primary key default uuid_generate_v4(),
    shift_id uuid not null references "Shifts" (id) on delete cascade,
    vat_rate decimal not null,
    gross_income decimal,
    net_income decimal,
    vat_amount decimal
);

-- Create User_Roles table
create table "User_Roles" (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users (id) on delete cascade,
    role text not null check (role in ('admin', 'user')),
    company_id uuid references "Companies" (id) on delete cascade,
    created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table "Companies" enable row level security;
alter table "Cars" enable row level security;
alter table "Drivers" enable row level security;
alter table "Shifts" enable row level security;
alter table "VAT_Details" enable row level security;
alter table "User_Roles" enable row level security;

-- Create policies for Companies
create policy "companies_select_policy" on "Companies"
    for select using (
        exists (
            select 1 from "User_Roles"
            where "User_Roles".user_id = auth.uid()
            and "User_Roles".company_id = "Companies".id
        )
    );

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

-- Create policies for Cars
create policy "cars_select_policy" on "Cars"
    for select using (
        exists (
            select 1 from "User_Roles"
            where "User_Roles".user_id = auth.uid()
            and "User_Roles".company_id = "Cars".company_id
        )
    );

create policy "cars_insert_policy" on "Cars"
    for insert with check (
        exists (
            select 1 from "User_Roles"
            where "User_Roles".user_id = auth.uid()
            and "User_Roles".company_id = "Cars".company_id
            and "User_Roles".role = 'admin'
        )
    );

-- Create policies for Drivers
create policy "drivers_select_policy" on "Drivers"
    for select using (
        exists (
            select 1 from "User_Roles"
            where "User_Roles".user_id = auth.uid()
            and "User_Roles".company_id = "Drivers".company_id
        )
    );

create policy "drivers_insert_policy" on "Drivers"
    for insert with check (
        exists (
            select 1 from "User_Roles"
            where "User_Roles".user_id = auth.uid()
            and "User_Roles".company_id = "Drivers".company_id
            and "User_Roles".role = 'admin'
        )
    );

-- Create policies for Shifts
create policy "shifts_select_policy" on "Shifts"
    for select using (
        exists (
            select 1 from "Cars"
            join "User_Roles" on "User_Roles".company_id = "Cars".company_id
            where "User_Roles".user_id = auth.uid()
            and "Cars".id = "Shifts".car_id
        )
    );

create policy "shifts_insert_policy" on "Shifts"
    for insert with check (
        exists (
            select 1 from "Cars"
            join "User_Roles" on "User_Roles".company_id = "Cars".company_id
            where "User_Roles".user_id = auth.uid()
            and "Cars".id = "Shifts".car_id
        )
    );

-- Create policies for VAT_Details
create policy "vat_details_select_policy" on "VAT_Details"
    for select using (
        exists (
            select 1 from "Shifts"
            join "Cars" on "Cars".id = "Shifts".car_id
            join "User_Roles" on "User_Roles".company_id = "Cars".company_id
            where "User_Roles".user_id = auth.uid()
            and "Shifts".id = "VAT_Details".shift_id
        )
    );

create policy "vat_details_insert_policy" on "VAT_Details"
    for insert with check (
        exists (
            select 1 from "Shifts"
            join "Cars" on "Cars".id = "Shifts".car_id
            join "User_Roles" on "User_Roles".company_id = "Cars".company_id
            where "User_Roles".user_id = auth.uid()
            and "Shifts".id = "VAT_Details".shift_id
        )
    );

-- Create policies for User_Roles
create policy "user_roles_select_policy" on "User_Roles"
    for select using (
        auth.uid() = user_id
        or exists (
            select 1 from "User_Roles" ur
            where ur.user_id = auth.uid()
            and ur.role = 'admin'
            and ur.company_id = "User_Roles".company_id
        )
    );

create policy "user_roles_insert_policy" on "User_Roles"
    for insert with check (
        auth.uid() = user_id
        or exists (
            select 1 from "User_Roles"
            where "User_Roles".user_id = auth.uid()
            and "User_Roles".role = 'admin'
        )
    );