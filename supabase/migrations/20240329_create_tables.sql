-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE "Companies" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_nr TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cars table
CREATE TABLE "Cars" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    regnr TEXT UNIQUE NOT NULL,
    drosknr TEXT NOT NULL,
    company_id UUID REFERENCES "Companies"(id) ON DELETE CASCADE
);

-- Drivers table
CREATE TABLE "Drivers" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    forarid TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    company_id UUID REFERENCES "Companies"(id) ON DELETE CASCADE
);

-- Shifts table
CREATE TABLE "Shifts" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    car_id UUID REFERENCES "Cars"(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES "Drivers"(id) ON DELETE CASCADE,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    taxi_km NUMERIC NOT NULL DEFAULT 0,
    paid_km NUMERIC NOT NULL DEFAULT 0,
    trips INT NOT NULL DEFAULT 0,
    report_nr TEXT NOT NULL,
    cash NUMERIC NOT NULL DEFAULT 0,
    to_report NUMERIC NOT NULL DEFAULT 0,
    total_credit NUMERIC NOT NULL DEFAULT 0,
    drikskredit NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VAT Details table
CREATE TABLE "VAT_Details" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shift_id UUID REFERENCES "Shifts"(id) ON DELETE CASCADE,
    vat_rate NUMERIC NOT NULL,
    gross_income NUMERIC NOT NULL,
    net_income NUMERIC NOT NULL,
    vat_amount NUMERIC NOT NULL,
    type TEXT CHECK (type IN ('kontant', 'kredit')) NOT NULL
);

-- Total Inkört Details table
CREATE TABLE "Total_Inkort_Details" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shift_id UUID REFERENCES "Shifts"(id) ON DELETE CASCADE,
    total_inkort NUMERIC NOT NULL,
    moms_percentage NUMERIC NOT NULL,
    brutto NUMERIC NOT NULL,
    netto NUMERIC NOT NULL,
    moms_kr NUMERIC NOT NULL
);

-- BOM Details table
CREATE TABLE "BOM_Details" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shift_id UUID REFERENCES "Shifts"(id) ON DELETE CASCADE,
    moms_percentage NUMERIC NOT NULL,
    brutto NUMERIC NOT NULL,
    netto NUMERIC NOT NULL,
    moms_kr NUMERIC NOT NULL
);

-- Enable Row Level Security
ALTER TABLE "Companies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Cars" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Drivers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Shifts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VAT_Details" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Total_Inkort_Details" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BOM_Details" ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "companies_select_policy" ON "Companies"
    FOR SELECT USING (true);

CREATE POLICY "companies_insert_policy" ON "Companies"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "cars_select_policy" ON "Cars"
    FOR SELECT USING (true);

CREATE POLICY "cars_insert_policy" ON "Cars"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "drivers_select_policy" ON "Drivers"
    FOR SELECT USING (true);

CREATE POLICY "drivers_insert_policy" ON "Drivers"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "shifts_select_policy" ON "Shifts"
    FOR SELECT USING (true);

CREATE POLICY "shifts_insert_policy" ON "Shifts"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "vat_details_select_policy" ON "VAT_Details"
    FOR SELECT USING (true);

CREATE POLICY "vat_details_insert_policy" ON "VAT_Details"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "total_inkort_details_select_policy" ON "Total_Inkort_Details"
    FOR SELECT USING (true);

CREATE POLICY "total_inkort_details_insert_policy" ON "Total_Inkort_Details"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "bom_details_select_policy" ON "BOM_Details"
    FOR SELECT USING (true);

CREATE POLICY "bom_details_insert_policy" ON "BOM_Details"
    FOR INSERT WITH CHECK (true);