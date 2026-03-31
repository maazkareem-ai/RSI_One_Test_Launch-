-- RSI ONE SEED DATA
-- Run this after schema.sql to populate with test data

-- =============================================
-- SEED USER PROFILES
-- =============================================
-- Note: You must first create users via Supabase Auth or the /api/auth/register endpoint
-- Then manually insert their profiles here with their actual UUIDs from auth.users

-- Example: Insert profiles for test users (replace UUIDs with actual auth user IDs)
-- INSERT INTO user_profiles (id, email, full_name, role, phone_number, is_active) VALUES
-- ('REPLACE-WITH-ACTUAL-UUID-1', 'owner@rsi.com', 'John Owner', 'owner', '+1234567890', true),
-- ('REPLACE-WITH-ACTUAL-UUID-2', 'manager@rsi.com', 'Jane Manager', 'manager', '+1234567891', true),
-- ('REPLACE-WITH-ACTUAL-UUID-3', 'pilot@rsi.com', 'Mike Pilot', 'pilot', '+1234567892', true),
-- ('REPLACE-WITH-ACTUAL-UUID-4', 'admin@rsi.com', 'Sarah Admin', 'rsi_admin', '+1234567893', true),
-- ('REPLACE-WITH-ACTUAL-UUID-5', 'tech@rsi.com', 'Tom Technician', 'technician', '+1234567894', true);

-- =============================================
-- NOTE: For automated seeding, use the seed script
-- Run: node database/seed.js
-- This will use the API endpoints to create test users and data
-- =============================================
