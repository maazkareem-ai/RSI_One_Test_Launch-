# ✅ Supabase Setup Checklist

Follow these steps in order to set up your Supabase database for RSI ONE.

---

## 📋 Pre-Setup

- [ ] Have a Supabase account (sign up at https://supabase.com)
- [ ] Create a new project in Supabase
- [ ] Note down your project URL and keys (already in your .env file)

---

## 🗄️ Step 1: Run Database Schema (5 minutes)

### Instructions:

1. **Open Supabase SQL Editor**
   - Go to your Supabase Dashboard
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New Query"** button

2. **Copy Schema File**
   - Open `database/schema.sql` from this project
   - Copy **ALL** contents (Ctrl+A, Ctrl+C)

3. **Paste and Run**
   - Paste into Supabase SQL Editor
   - Click **"Run"** button (or Ctrl+Enter)
   - Wait for success message

4. **Verify Tables Created**
   - Click **"Table Editor"** in left sidebar
   - You should see these tables:
     - [ ] user_profiles
     - [ ] user_activity_logs
     - [ ] assets
     - [ ] asset_attachments
     - [ ] flight_logs
     - [ ] maintenance_logs
     - [ ] expenses
     - [ ] expense_attachments
     - [ ] processed_documents

### ⚠️ Troubleshooting

**Error: "extension uuid-ossp already exists"**
- ✅ This is OK! Just means the extension was already installed.

**Error: "table already exists"**
- ✅ This is OK if you're re-running the schema.
- ❌ If fresh setup, something went wrong. Drop all tables and retry.

---

## 📦 Step 2: Create Storage Bucket (2 minutes)

### Instructions:

1. **Navigate to Storage**
   - Click **"Storage"** in left sidebar
   - You should see the Storage dashboard

2. **Create Bucket**
   - Click **"New Bucket"** button
   - Name: `documents`
   - Make it: **Private** (not public)
   - Click **"Create bucket"**

3. **Set Bucket Policies**
   - Click on the `documents` bucket
   - Click **"Policies"** tab at the top
   - Click **"New Policy"**
   - Select template: **"Give users access to only their own files"**
   - OR use this custom policy:

   ```sql
   -- Allow authenticated users to upload
   CREATE POLICY "Authenticated users can upload" ON storage.objects
   FOR INSERT TO authenticated
   WITH CHECK (bucket_id = 'documents');

   -- Allow authenticated users to read
   CREATE POLICY "Authenticated users can read" ON storage.objects
   FOR SELECT TO authenticated
   USING (bucket_id = 'documents');

   -- Allow users to delete own files
   CREATE POLICY "Users can delete own files" ON storage.objects
   FOR DELETE TO authenticated
   USING (bucket_id = 'documents' AND auth.uid() = owner);
   ```

4. **Verify Bucket Created**
   - [ ] Bucket named `documents` exists
   - [ ] Bucket is set to Private
   - [ ] Policies are active

---

## 🌱 Step 3: Seed Test Data (3 minutes)

### Option A: Using Seed Script (Recommended)

1. **Open Terminal** in project root
2. **Run seed command:**
   ```bash
   npm run seed
   ```
3. **Wait for completion** - Should see:
   ```
   ✅ Created 5 users
   ✅ Created 5 assets
   ✅ Created 40 flight logs
   ✅ Created 25 maintenance logs
   ✅ Created 40 expenses
   ✅ Created 9 documents
   ✨ Database seeding completed successfully!
   ```

### Option B: Manual User Creation

If seed script fails, create users manually:

1. **Create Users via API**
   ```bash
   # Start server first
   npm start

   # Then register users (in new terminal)
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "manager@rsi.com",
       "password": "Password123!",
       "full_name": "Jane Manager",
       "role": "manager",
       "phone_number": "+1234567891"
     }'
   ```

2. **Repeat for all test users:**
   - owner@rsi.com (role: owner)
   - manager@rsi.com (role: manager)
   - pilot@rsi.com (role: pilot)
   - admin@rsi.com (role: rsi_admin)
   - tech@rsi.com (role: technician)

---

## ✅ Step 4: Verify Setup

### Check Tables Have Data

1. Go to **Table Editor** in Supabase
2. Click on each table and verify data exists:
   - [ ] **user_profiles** - Should have 5 users
   - [ ] **assets** - Should have 5 assets (jets, helicopters, yacht)
   - [ ] **flight_logs** - Should have ~40 flight logs
   - [ ] **maintenance_logs** - Should have ~25 maintenance records
   - [ ] **expenses** - Should have ~40 expense records
   - [ ] **processed_documents** - Should have ~9 documents

### Test API Access

1. **Health Check**
   ```bash
   curl http://localhost:3000/health
   ```
   Expected: `{"status":"OK"...}`

2. **Login Test**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"manager@rsi.com","password":"Password123!"}'
   ```
   Expected: Access token in response

3. **Get Assets Test**
   ```bash
   curl -X GET http://localhost:3000/api/assets \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```
   Expected: Array of 5 assets

---

## 🔐 Step 5: Security Check

### Verify RLS is Enabled

1. Go to **Table Editor**
2. For each table, check **RLS status** (should show enabled):
   - [ ] user_profiles - RLS enabled
   - [ ] assets - RLS enabled
   - [ ] flight_logs - RLS enabled
   - [ ] maintenance_logs - RLS enabled
   - [ ] expenses - RLS enabled
   - [ ] processed_documents - RLS enabled

### Verify Storage Security

1. Go to **Storage** → `documents` bucket
2. Click **Policies** tab
3. Verify policies exist for:
   - [ ] Upload (INSERT)
   - [ ] Download (SELECT)
   - [ ] Delete (DELETE)

---

## 🎯 Final Checklist

Before starting development:

- [ ] All 9 tables exist in Supabase
- [ ] All tables have RLS enabled
- [ ] Storage bucket `documents` created and private
- [ ] Storage bucket has access policies
- [ ] Seed data successfully created (5 users, 5 assets, etc.)
- [ ] Server starts without errors (`npm start`)
- [ ] Can login via API
- [ ] Can fetch assets via API
- [ ] Can see data in Supabase Table Editor

---

## 🐛 Common Issues & Solutions

### Issue: Seed script fails with "user already exists"
**Solution:** Users might exist from previous run. This is OK - script will skip them.

### Issue: "Invalid API key" when running seed
**Solution:** Check `.env` file has correct `SUPABASE_SERVICE_ROLE_KEY`

### Issue: "Storage bucket not found" error
**Solution:** Create `documents` bucket in Supabase Storage

### Issue: Can't see data in tables
**Solution:** 
1. Check seed script completed successfully
2. Verify user has correct role in user_profiles
3. Check RLS policies allow viewing data

### Issue: API returns 401 Unauthorized
**Solution:**
1. Verify you're using correct access_token from login
2. Token format: `Bearer <token>` (with space)
3. Token might be expired - login again

### Issue: File upload fails
**Solution:**
1. Verify storage bucket exists
2. Check bucket policies allow upload
3. Verify file size is within limits

---

## 📞 Need Help?

If you encounter issues:

1. **Check Supabase Logs**
   - Dashboard → Logs
   - Look for error messages

2. **Check Server Console**
   - Look for error messages in terminal

3. **Check Table Editor**
   - Verify data exists in tables
   - Check user roles are correct

4. **Review RLS Policies**
   - Authentication → Policies
   - Ensure policies match your use case

---

## ✨ Success Indicators

You're ready to develop when:

✅ Server starts successfully
✅ Login returns access token
✅ Can fetch assets with token
✅ Data visible in Supabase dashboard
✅ Storage bucket configured
✅ No console errors

---

**Setup Complete! Start building amazing features! 🚀**
