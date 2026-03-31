# 🚀 QUICK START GUIDE - RSI ONE Backend

## ⚡ Setup in 5 Minutes

### Step 1: Setup Database (2 minutes)

1. **Open Supabase SQL Editor**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Click "SQL Editor" in the left menu
   - Click "New Query"

2. **Run the Schema**
   - Copy ENTIRE contents of `database/schema.sql`
   - Paste into SQL Editor
   - Click "Run" or press `Ctrl+Enter`
   - Wait for "Success" message

3. **Create Storage Bucket**
   - Click "Storage" in left menu
   - Click "New Bucket"
   - Name it: `documents`
   - Make it: **Private**
   - Click "Create bucket"
   - Click on the bucket → "Policies" → "New Policy"
   - Select "Authenticated users can upload"
   - Click "Save"

### Step 2: Seed Test Data (1 minute)

```bash
npm run seed
```

This creates:
- ✅ 5 test users with different roles
- ✅ 5 assets (aircraft + yacht)
- ✅ 40 flight logs
- ✅ 25 maintenance logs
- ✅ 40 expenses
- ✅ 9 processed documents

### Step 3: Start Server (30 seconds)

```bash
npm start
```

Server runs at: `http://localhost:3000`

### Step 4: Test It! (1 minute)

#### Test 1: Check Health
Open browser: http://localhost:3000/health

#### Test 2: Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@rsi.com","password":"Password123!"}'
```

Copy the `access_token` from response.

#### Test 3: Get Assets
```bash
curl -X GET http://localhost:3000/api/assets \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

You should see 5 assets with all details!

---

## 🎯 Quick API Examples

### Login & Get Token
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@rsi.com","password":"Password123!"}'

# Save the access_token, then use it in all requests:
# -H "Authorization: Bearer YOUR_TOKEN"
```

### View Your Profile
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get All Assets
```bash
curl -X GET http://localhost:3000/api/assets \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Flight Logs for Asset
```bash
curl -X GET "http://localhost:3000/api/flight-logs?asset_id=ASSET_UUID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create New Flight Log
```bash
curl -X POST http://localhost:3000/api/flight-logs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "asset_id": "ASSET_UUID_HERE",
    "flight_date": "2024-12-07",
    "departure_icao": "KJFK",
    "arrival_icao": "KLAX",
    "flight_hours": 5.5,
    "cycles": 1,
    "notes": "Smooth flight"
  }'
```

### Get Overdue Maintenance
```bash
curl -X GET http://localhost:3000/api/maintenance/overdue \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Expense Summary
```bash
curl -X GET http://localhost:3000/api/expenses/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 👥 Test User Accounts

All passwords: `Password123!`

| Email | Role | Permissions |
|-------|------|-------------|
| `owner@rsi.com` | Owner | Full access, can delete assets |
| `manager@rsi.com` | Manager | Manage assets, expenses, documents |
| `pilot@rsi.com` | Pilot | Create flight logs |
| `admin@rsi.com` | RSI Admin | Full system access |
| `tech@rsi.com` | Technician | Create maintenance logs |

---

## 🎨 Using Postman/Thunder Client

### Setup Collection

1. **Create Environment**
   - `baseUrl`: `http://localhost:3000`
   - `token`: (empty - will fill after login)

2. **Login Request**
   ```
   POST {{baseUrl}}/api/auth/login
   Body (JSON):
   {
     "email": "manager@rsi.com",
     "password": "Password123!"
   }
   ```
   
3. **Copy access_token** from response and save to `token` variable

4. **Use Token in Other Requests**
   ```
   Authorization: Bearer {{token}}
   ```

---

## 📊 Check Data in Supabase

After seeding:

1. Go to Supabase Dashboard → **Table Editor**
2. Check these tables:
   - `user_profiles` → 5 users
   - `assets` → 5 assets
   - `flight_logs` → 40 logs
   - `maintenance_logs` → 25 logs
   - `expenses` → 40 expenses
   - `processed_documents` → 9 documents

---

## 🔍 Viewing Data in Response

### Sample Asset Response:
```json
{
  "assets": [
    {
      "id": "uuid-here",
      "asset_name": "Gulfstream G650",
      "asset_type": "jet",
      "model": "G650ER",
      "registration_number": "N123GS",
      "total_flight_hours": 1250.5,
      "total_cycles": 450,
      "insurance_expiry": "2025-12-31",
      "arc_expiry": "2025-06-30"
    }
  ],
  "total": 5
}
```

### Sample Flight Log Response:
```json
{
  "flight_logs": [
    {
      "id": "uuid-here",
      "flight_date": "2024-11-15",
      "departure_icao": "KJFK",
      "arrival_icao": "KLAX",
      "flight_hours": 5.25,
      "cycles": 1,
      "assets": {
        "asset_name": "Gulfstream G650",
        "registration_number": "N123GS"
      }
    }
  ]
}
```

---

## ✅ Verification Checklist

- [ ] Database schema runs without errors
- [ ] Storage bucket `documents` created
- [ ] Seed script completes successfully
- [ ] Server starts on port 3000
- [ ] Health check returns OK
- [ ] Can login with test users
- [ ] Can fetch assets with token
- [ ] Can create new flight log
- [ ] Can see data in Supabase dashboard

---

## 🐛 Common Issues

### "relation does not exist"
→ Run schema.sql in Supabase SQL Editor

### "storage bucket not found"
→ Create `documents` bucket in Supabase Storage

### "Invalid token"
→ Make sure to use: `Bearer YOUR_TOKEN` (with space after Bearer)

### "user_profiles does not exist"
→ User was created in auth but not in profiles table. Run seed script again.

### Server won't start
→ Check .env file has correct SUPABASE credentials

---

## 🎉 You're Ready!

Your backend is now:
- ✅ Fully functional with all APIs
- ✅ Populated with test data
- ✅ Ready to connect to frontend
- ✅ Secured with JWT authentication
- ✅ Protected with role-based access

**Next Steps:**
1. Test all endpoints with Postman
2. View data in Supabase dashboard
3. Connect your frontend
4. Build amazing features!

---

**Need help?** Check the full README.md for detailed documentation.
