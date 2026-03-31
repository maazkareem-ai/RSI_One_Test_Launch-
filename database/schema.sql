-- RSI ONE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USER PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'pilot', 'rsi_admin', 'technician')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- USER ACTIVITY LOGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- OTP TABLE (For Password Reset)
-- =============================================
CREATE TABLE IF NOT EXISTS otp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  otp TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ASSETS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_name TEXT NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('jet', 'turboprop', 'helicopter', 'yacht')),
  model TEXT NOT NULL,
  serial_number TEXT,
  registration_number TEXT UNIQUE,
  manufacture_date DATE,
  base_location_icao TEXT,
  insurance_expiry DATE,
  arc_expiry DATE,
  cofa_expiry DATE,
  description TEXT,
  total_flight_hours DECIMAL(10, 2) DEFAULT 0,
  total_cycles INTEGER DEFAULT 0,
  owner_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ASSET ATTACHMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS asset_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FLIGHT LOGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS flight_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  pilot_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  flight_date DATE NOT NULL,
  departure_icao TEXT,
  arrival_icao TEXT,
  flight_hours DECIMAL(10, 2) NOT NULL,
  cycles INTEGER DEFAULT 1,
  fuel_consumed DECIMAL(10, 2),
  notes TEXT,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- MAINTENANCE LOGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS maintenance_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL CHECK (maintenance_type IN ('a_check', 'c_check', 'service_bulletin', 'airworthiness_directive', 'unscheduled')),
  maintenance_date DATE NOT NULL,
  flight_hours_at_maintenance DECIMAL(10, 2),
  cycles_at_maintenance INTEGER,
  next_due_hours DECIMAL(10, 2),
  next_due_cycles INTEGER,
  next_due_date DATE,
  components_replaced TEXT,
  technician_name TEXT,
  technician_license TEXT,
  cost DECIMAL(10, 2),
  vendor TEXT,
  description TEXT,
  notes TEXT,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- EXPENSES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  expense_date DATE NOT NULL,
  vendor TEXT NOT NULL,
  category TEXT CHECK (category IN ('maintenance', 'fuel', 'insurance', 'crew', 'hangar', 'miscellaneous')),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  invoice_number TEXT,
  description TEXT,
  payment_method TEXT,
  notes TEXT,
  is_flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- EXPENSE ATTACHMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS expense_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PROCESSED DOCUMENTS TABLE (OCR)
-- =============================================
CREATE TABLE IF NOT EXISTS processed_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  document_type TEXT,
  asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  extracted_data JSONB,
  confidence_score DECIMAL(3, 2),
  status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
  rejection_reason TEXT,
  processed_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  rejected_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_user_id ON otp(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_used ON otp(used);
CREATE INDEX IF NOT EXISTS idx_assets_asset_type ON assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_assets_owner_id ON assets(owner_id);
CREATE INDEX IF NOT EXISTS idx_asset_attachments_asset_id ON asset_attachments(asset_id);
CREATE INDEX IF NOT EXISTS idx_flight_logs_asset_id ON flight_logs(asset_id);
CREATE INDEX IF NOT EXISTS idx_flight_logs_pilot_id ON flight_logs(pilot_id);
CREATE INDEX IF NOT EXISTS idx_flight_logs_flight_date ON flight_logs(flight_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_asset_id ON maintenance_logs(asset_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_maintenance_type ON maintenance_logs(maintenance_type);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_next_due_date ON maintenance_logs(next_due_date);
CREATE INDEX IF NOT EXISTS idx_expenses_asset_id ON expenses(asset_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_processed_documents_asset_id ON processed_documents(asset_id);
CREATE INDEX IF NOT EXISTS idx_processed_documents_status ON processed_documents(status);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE processed_documents ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies (must be first since other policies reference this table)
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Activity Logs Policies
CREATE POLICY "Users can view own activity logs" ON user_activity_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can insert activity logs" ON user_activity_logs FOR INSERT WITH CHECK (true);

-- OTP Policies
CREATE POLICY "Users can view own OTPs" ON otp FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can insert OTPs" ON otp FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own OTPs" ON otp FOR UPDATE USING (user_id = auth.uid());

-- Assets Policies (simplified - no nested subqueries on same table)
CREATE POLICY "Authenticated users can view assets" ON assets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create assets" ON assets FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update assets" ON assets FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete assets" ON assets FOR DELETE TO authenticated USING (true);

-- Flight Logs Policies
CREATE POLICY "Authenticated users can view flight logs" ON flight_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create flight logs" ON flight_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update flight logs" ON flight_logs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete flight logs" ON flight_logs FOR DELETE TO authenticated USING (true);

-- Maintenance Logs Policies
CREATE POLICY "Authenticated users can view maintenance" ON maintenance_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create maintenance" ON maintenance_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update maintenance" ON maintenance_logs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete maintenance" ON maintenance_logs FOR DELETE TO authenticated USING (true);

-- Expenses Policies
CREATE POLICY "Authenticated users can view expenses" ON expenses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create expenses" ON expenses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update expenses" ON expenses FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete expenses" ON expenses FOR DELETE TO authenticated USING (true);

-- Attachment Policies
CREATE POLICY "Authenticated users can view attachments" ON asset_attachments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can upload attachments" ON asset_attachments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete attachments" ON asset_attachments FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view expense attachments" ON expense_attachments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can upload expense attachments" ON expense_attachments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete expense attachments" ON expense_attachments FOR DELETE TO authenticated USING (true);

-- Documents Policies
CREATE POLICY "Authenticated users can view documents" ON processed_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can upload documents" ON processed_documents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update documents" ON processed_documents FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete documents" ON processed_documents FOR DELETE TO authenticated USING (true);

-- =============================================
-- STORAGE BUCKETS
-- =============================================
-- Create storage buckets in Supabase dashboard:
-- 1. 'documents' - for all documents (invoices, manuals, certificates, OCR files)
-- Make sure to set appropriate policies for authenticated users

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flight_logs_updated_at BEFORE UPDATE ON flight_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_logs_updated_at BEFORE UPDATE ON maintenance_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE COMMENTS
-- =============================================
COMMENT ON TABLE user_profiles IS 'Stores user profile information and roles';
COMMENT ON TABLE assets IS 'Aircraft and yacht asset information';
COMMENT ON TABLE flight_logs IS 'Flight hours and cycles tracking';
COMMENT ON TABLE maintenance_logs IS 'Maintenance history and schedules';
COMMENT ON TABLE expenses IS 'Financial tracking for assets';
COMMENT ON TABLE processed_documents IS 'OCR processed documents with extracted data';
