-- CLEANUP SCRIPT
-- Run this FIRST in Supabase SQL Editor to remove old tables and policies

-- Drop all policies first
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own activity logs" ON user_activity_logs;
DROP POLICY IF EXISTS "System can insert activity logs" ON user_activity_logs;
DROP POLICY IF EXISTS "Authenticated users can view assets" ON assets;
DROP POLICY IF EXISTS "Authenticated users can create assets" ON assets;
DROP POLICY IF EXISTS "Authenticated users can update assets" ON assets;
DROP POLICY IF EXISTS "Authenticated users can delete assets" ON assets;
DROP POLICY IF EXISTS "Authenticated users can view flight logs" ON flight_logs;
DROP POLICY IF EXISTS "Authenticated users can create flight logs" ON flight_logs;
DROP POLICY IF EXISTS "Authenticated users can update flight logs" ON flight_logs;
DROP POLICY IF EXISTS "Authenticated users can delete flight logs" ON flight_logs;
DROP POLICY IF EXISTS "Authenticated users can view maintenance" ON maintenance_logs;
DROP POLICY IF EXISTS "Authenticated users can create maintenance" ON maintenance_logs;
DROP POLICY IF EXISTS "Authenticated users can update maintenance" ON maintenance_logs;
DROP POLICY IF EXISTS "Authenticated users can delete maintenance" ON maintenance_logs;
DROP POLICY IF EXISTS "Authenticated users can view expenses" ON expenses;
DROP POLICY IF EXISTS "Authenticated users can create expenses" ON expenses;
DROP POLICY IF EXISTS "Authenticated users can update expenses" ON expenses;
DROP POLICY IF EXISTS "Authenticated users can delete expenses" ON expenses;
DROP POLICY IF EXISTS "Authenticated users can view attachments" ON asset_attachments;
DROP POLICY IF EXISTS "Authenticated users can upload attachments" ON asset_attachments;
DROP POLICY IF EXISTS "Authenticated users can delete attachments" ON asset_attachments;
DROP POLICY IF EXISTS "Authenticated users can view expense attachments" ON expense_attachments;
DROP POLICY IF EXISTS "Authenticated users can upload expense attachments" ON expense_attachments;
DROP POLICY IF EXISTS "Authenticated users can delete expense attachments" ON expense_attachments;
DROP POLICY IF EXISTS "Authenticated users can view documents" ON processed_documents;
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON processed_documents;
DROP POLICY IF EXISTS "Authenticated users can update documents" ON processed_documents;
DROP POLICY IF EXISTS "Authenticated users can delete documents" ON processed_documents;

-- Drop triggers
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_assets_updated_at ON assets;
DROP TRIGGER IF EXISTS update_flight_logs_updated_at ON flight_logs;
DROP TRIGGER IF EXISTS update_maintenance_logs_updated_at ON maintenance_logs;
DROP TRIGGER IF EXISTS update_expenses_updated_at ON expenses;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop tables (in reverse order due to foreign keys)
DROP TABLE IF EXISTS processed_documents CASCADE;
DROP TABLE IF EXISTS expense_attachments CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS maintenance_logs CASCADE;
DROP TABLE IF EXISTS flight_logs CASCADE;
DROP TABLE IF EXISTS asset_attachments CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS user_activity_logs CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
