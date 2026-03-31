# RSI ONE API Testing Guide

## Base URL
```
http://localhost:3000
```

---

## 🔐 1. AUTHENTICATION

### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "role": "manager",
  "phone_number": "+1234567890"
}
```

**Roles:** `owner`, `manager`, `pilot`, `rsi_admin`, `technician`

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "manager@rsi.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { "id": "...", "email": "..." },
  "session": {
    "access_token": "eyJhbGci...",
    "refresh_token": "...",
    "expires_in": 3600
  }
}
```

**💡 Copy the `access_token` and use in all subsequent requests!**

### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "full_name": "John Updated Name",
  "phone_number": "+9876543210"
}
```

### Logout
```http
POST /api/auth/logout
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "manager@rsi.com"
}
```

### Get Activity Logs
```http
GET /api/auth/activity-logs?limit=20&offset=0
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## ✈️ 2. ASSETS

### Create Asset
```http
POST /api/assets
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "asset_name": "Boeing 737",
  "asset_type": "jet",
  "model": "737-800",
  "serial_number": "SN-737-001",
  "registration_number": "N737BB",
  "manufacture_date": "2020-01-15",
  "base_location_icao": "KJFK",
  "insurance_expiry": "2025-12-31",
  "arc_expiry": "2025-06-30",
  "cofa_expiry": "2026-12-31",
  "description": "Commercial passenger jet"
}
```

**Asset Types:** `jet`, `turboprop`, `helicopter`, `yacht`

### Get All Assets
```http
GET /api/assets?limit=50&offset=0
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**With Filters:**
```http
GET /api/assets?asset_type=jet&search=Gulfstream
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Get Asset by ID
```http
GET /api/assets/{asset_id}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Update Asset
```http
PUT /api/assets/{asset_id}
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "total_flight_hours": 1500.5,
  "insurance_expiry": "2026-12-31"
}
```

### Delete Asset
```http
DELETE /api/assets/{asset_id}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Upload Asset Attachment
```http
POST /api/assets/{asset_id}/attachments
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: multipart/form-data

file: [SELECT FILE]
```

### Get Asset Attachments
```http
GET /api/assets/{asset_id}/attachments
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Download Attachment
```http
GET /api/assets/attachments/{attachment_id}/download
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Delete Attachment
```http
DELETE /api/assets/attachments/{attachment_id}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Get Expiry Reminders
```http
GET /api/assets/{asset_id}/reminders
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 🛫 3. FLIGHT LOGS

### Create Flight Log
```http
POST /api/flight-logs
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "asset_id": "uuid-of-asset",
  "flight_date": "2024-12-07",
  "departure_icao": "KJFK",
  "arrival_icao": "KLAX",
  "flight_hours": 5.5,
  "cycles": 1,
  "fuel_consumed": 2500.5,
  "notes": "Smooth flight, no issues"
}
```

### Get All Flight Logs
```http
GET /api/flight-logs?limit=50&offset=0
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**With Filters:**
```http
GET /api/flight-logs?asset_id={uuid}&start_date=2024-01-01&end_date=2024-12-31
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Get Flight Log by ID
```http
GET /api/flight-logs/{log_id}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Update Flight Log
```http
PUT /api/flight-logs/{log_id}
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "flight_hours": 5.75,
  "notes": "Updated notes"
}
```

### Delete Flight Log
```http
DELETE /api/flight-logs/{log_id}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Upload CSV Flight Logs
```http
POST /api/flight-logs/upload-csv
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: multipart/form-data

file: [SELECT CSV FILE]
```

**CSV Format:**
```csv
asset_id,flight_date,departure_icao,arrival_icao,flight_hours,cycles,fuel_consumed,notes
uuid-here,2024-12-07,KJFK,KLAX,5.5,1,2500.5,Test flight
```

### Get Asset Utilization Stats
```http
GET /api/flight-logs/utilization/stats?asset_id={uuid}&start_date=2024-01-01&end_date=2024-12-31
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 🔧 4. MAINTENANCE

### Create Maintenance Log
```http
POST /api/maintenance
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "asset_id": "uuid-of-asset",
  "maintenance_type": "a_check",
  "maintenance_date": "2024-12-07",
  "flight_hours_at_maintenance": 1250.5,
  "cycles_at_maintenance": 450,
  "next_due_hours": 1350.5,
  "next_due_cycles": 500,
  "next_due_date": "2025-03-07",
  "components_replaced": "Oil filter, spark plugs",
  "technician_name": "Tom Tech",
  "technician_license": "A&P-12345",
  "cost": 2500.00,
  "vendor": "Aviation Services Inc",
  "description": "100-hour inspection completed"
}
```

**Maintenance Types:** `a_check`, `c_check`, `service_bulletin`, `airworthiness_directive`, `unscheduled`

### Get All Maintenance Logs
```http
GET /api/maintenance?limit=50&offset=0
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**With Filters:**
```http
GET /api/maintenance?asset_id={uuid}&maintenance_type=a_check
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Get Maintenance Log by ID
```http
GET /api/maintenance/{log_id}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Update Maintenance Log
```http
PUT /api/maintenance/{log_id}
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "cost": 2750.00,
  "notes": "Additional work performed"
}
```

### Delete Maintenance Log
```http
DELETE /api/maintenance/{log_id}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Get Overdue Maintenance
```http
GET /api/maintenance/overdue
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**With Filter:**
```http
GET /api/maintenance/overdue?asset_id={uuid}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Get Upcoming Maintenance
```http
GET /api/maintenance/upcoming?days=30
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### AI Predict Next Maintenance
```http
GET /api/maintenance/{asset_id}/predict
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 💰 5. EXPENSES

### Create Expense
```http
POST /api/expenses
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "asset_id": "uuid-of-asset",
  "expense_date": "2024-12-07",
  "vendor": "Aviation Fuel Co",
  "category": "fuel",
  "amount": 5000.00,
  "currency": "USD",
  "invoice_number": "INV-12345",
  "description": "Fuel for December flights",
  "payment_method": "Credit Card"
}
```

**Categories:** `maintenance`, `fuel`, `insurance`, `crew`, `hangar`, `miscellaneous`

### Get All Expenses
```http
GET /api/expenses?limit=50&offset=0
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**With Filters:**
```http
GET /api/expenses?asset_id={uuid}&category=fuel&is_flagged=true
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Get Expense by ID
```http
GET /api/expenses/{expense_id}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Update Expense
```http
PUT /api/expenses/{expense_id}
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "amount": 5250.00,
  "is_flagged": false
}
```

### Delete Expense
```http
DELETE /api/expenses/{expense_id}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Upload Expense Attachment (Invoice)
```http
POST /api/expenses/{expense_id}/attachments
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: multipart/form-data

file: [SELECT FILE]
```

### Get Expense Summary
```http
GET /api/expenses/summary?asset_id={uuid}&start_date=2024-01-01&end_date=2024-12-31
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Detect Duplicate Expenses
```http
GET /api/expenses/duplicates?asset_id={uuid}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 📄 6. DOCUMENTS (OCR)

### Process Document with OCR
```http
POST /api/documents/process
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: multipart/form-data

file: [SELECT FILE]
document_type: invoice
asset_id: uuid-of-asset
```

**Document Types:** `invoice`, `maintenance_report`, `certificate`, `manual`

### Get All Documents
```http
GET /api/documents?limit=50&offset=0
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**With Filters:**
```http
GET /api/documents?status=pending_review&document_type=invoice
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Statuses:** `pending_review`, `approved`, `rejected`

### Get Document by ID
```http
GET /api/documents/{document_id}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Approve Document
```http
POST /api/documents/{document_id}/approve
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "create_expense": true,
  "create_maintenance": false,
  "corrections": {
    "amount": 5500.00,
    "vendor": "Corrected Vendor Name"
  }
}
```

### Reject Document
```http
POST /api/documents/{document_id}/reject
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "reason": "Poor quality scan, unable to extract data"
}
```

---

## 🏥 HEALTH CHECK

```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "message": "RSI One Backend API is running",
  "timestamp": "2024-12-07T13:19:37.052Z"
}
```

---

## 📋 Query Parameters Guide

### Pagination
- `limit` - Number of results (default: 50)
- `offset` - Skip results (default: 0)

### Date Filters
- `start_date` - Filter from date (format: YYYY-MM-DD)
- `end_date` - Filter to date (format: YYYY-MM-DD)

### Search
- `search` - Text search in relevant fields
- `asset_id` - Filter by specific asset
- `category` - Filter by category
- `status` - Filter by status
- `is_flagged` - Filter flagged items (true/false)

---

## 🎯 Testing Workflow

1. **Login** → Get access_token
2. **Create Asset** → Get asset_id
3. **Create Flight Log** → Using asset_id
4. **Create Maintenance** → Using asset_id
5. **Create Expense** → Using asset_id
6. **Upload Document** → Process with OCR
7. **Approve Document** → Auto-create expense/maintenance
8. **View Reports** → Summaries, overdue, predictions

---

## 💡 Tips

- Always include `Authorization: Bearer TOKEN` header
- Use `Content-Type: application/json` for JSON requests
- Use `Content-Type: multipart/form-data` for file uploads
- Check response status codes (200=success, 401=unauthorized, 400=bad request)
- Test with Postman, Thunder Client, or cURL
- View created data in Supabase Dashboard

---

**Happy Testing! 🚀**
