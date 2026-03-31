# 📁 RSI ONE Project Structure

```
RSI_One/
│
├── 📄 .env                              # Environment variables (Supabase credentials)
├── 📄 package.json                      # Project dependencies and scripts
├── 📄 package-lock.json                 # Locked dependencies
│
├── 📚 Documentation Files
│   ├── 📄 README.md                     # Complete documentation
│   ├── 📄 QUICKSTART.md                 # 5-minute setup guide
│   └── 📄 API_TESTING.md                # API endpoint testing guide
│
├── 🗄️ database/                         # Database setup files
│   ├── 📄 schema.sql                    # Complete database schema
│   ├── 📄 seed.sql                      # Manual seed instructions
│   └── 📄 seed.js                       # Automated seed script
│
├── 🚀 rsi_one_backend/                  # Main backend application
│   │
│   ├── 📄 main.js                       # Express server entry point
│   │
│   ├── ⚙️ config/                       # Configuration files
│   │   ├── 📄 supabase.js              # Supabase client setup
│   │   └── 📄 constants.js             # App-wide constants
│   │
│   ├── 🛡️ middleware/                   # Express middleware
│   │   ├── 📄 auth.middleware.js       # JWT authentication & authorization
│   │   ├── 📄 rateLimiter.middleware.js # IP-based rate limiting
│   │   └── 📄 upload.middleware.js     # File upload handling (Multer)
│   │
│   ├── 🎮 controllers/                  # Business logic
│   │   ├── 📄 auth.controller.js       # Authentication logic
│   │   ├── 📄 asset.controller.js      # Asset management logic
│   │   ├── 📄 flightLog.controller.js  # Flight log logic
│   │   ├── 📄 maintenance.controller.js # Maintenance log logic
│   │   ├── 📄 expense.controller.js    # Expense management logic
│   │   └── 📄 document.controller.js   # OCR/document processing logic
│   │
│   └── 🛣️ routes/                       # API endpoints
│       ├── 📄 auth.routes.js           # /api/auth/*
│       ├── 📄 asset.routes.js          # /api/assets/*
│       ├── 📄 flightLog.routes.js      # /api/flight-logs/*
│       ├── 📄 maintenance.routes.js    # /api/maintenance/*
│       ├── 📄 expense.routes.js        # /api/expenses/*
│       └── 📄 document.routes.js       # /api/documents/*
│
└── 📦 node_modules/                     # Installed dependencies (auto-generated)
```

---

## 🎯 File Purposes

### Root Level Files
- **`.env`** - Contains sensitive configuration (Supabase URLs, keys, JWT secret)
- **`package.json`** - Project metadata, dependencies, npm scripts
- **`README.md`** - Complete project documentation
- **`QUICKSTART.md`** - Fast setup guide for new developers
- **`API_TESTING.md`** - Comprehensive API testing reference

### Database Directory
- **`schema.sql`** - Complete database schema with tables, indexes, RLS policies
- **`seed.sql`** - Manual SQL seed instructions
- **`seed.js`** - Automated Node.js script to populate test data

### Backend Structure

#### Config (`rsi_one_backend/config/`)
- **`supabase.js`** - Exports configured Supabase clients (admin & public)
- **`constants.js`** - Defines roles, asset types, maintenance types, etc.

#### Middleware (`rsi_one_backend/middleware/`)
- **`auth.middleware.js`** - Validates JWT tokens, enforces role-based access
- **`rateLimiter.middleware.js`** - Prevents API abuse with rate limits
- **`upload.middleware.js`** - Handles file uploads with Multer

#### Controllers (`rsi_one_backend/controllers/`)
Business logic layer - processes requests, validates data, interacts with database
- **`auth.controller.js`** - Login, register, profile management
- **`asset.controller.js`** - CRUD for aircraft/yacht assets
- **`flightLog.controller.js`** - Flight hours, cycles tracking
- **`maintenance.controller.js`** - Maintenance schedules, predictions
- **`expense.controller.js`** - Financial tracking, anomaly detection
- **`document.controller.js`** - OCR processing, document approval

#### Routes (`rsi_one_backend/routes/`)
Defines API endpoints and applies middleware
- Each route file maps URLs to controller functions
- Applies authentication and authorization middleware
- Implements role-based access control

---

## 🔄 Request Flow

```
Client Request
    ↓
Express Server (main.js)
    ↓
Rate Limiter Middleware
    ↓
Route Handler (routes/*.js)
    ↓
Authentication Middleware
    ↓
Authorization Middleware (role check)
    ↓
Upload Middleware (if file upload)
    ↓
Controller (controllers/*.js)
    ↓
Supabase Database Query
    ↓
Response to Client
```

---

## 📊 Database Tables

Created by `schema.sql`:

1. **`user_profiles`** - User accounts and roles
2. **`user_activity_logs`** - Audit trail of user actions
3. **`assets`** - Aircraft and yacht information
4. **`asset_attachments`** - Files attached to assets
5. **`flight_logs`** - Flight hours and cycles tracking
6. **`maintenance_logs`** - Maintenance history and schedules
7. **`expenses`** - Financial tracking
8. **`expense_attachments`** - Invoice and receipt files
9. **`processed_documents`** - OCR-processed documents

---

## 🔐 Security Layers

1. **Environment Variables** - Sensitive data in `.env`
2. **JWT Authentication** - Supabase Auth tokens
3. **Row Level Security** - Database-level access control
4. **Role-Based Authorization** - Middleware checks user roles
5. **Rate Limiting** - Prevents API abuse
6. **Input Validation** - Controllers validate all inputs
7. **File Type Validation** - Upload middleware checks file types
8. **CORS Protection** - Configured in main.js

---

## 🎨 Code Organization Principles

### Separation of Concerns
- **Routes** - Define endpoints only
- **Middleware** - Cross-cutting concerns (auth, logging, uploads)
- **Controllers** - Business logic
- **Config** - Centralized configuration

### Modularity
- Each feature has its own controller and route file
- Reusable middleware components
- Shared constants and utilities

### Scalability
- Easy to add new features (new controller + route file)
- Middleware can be applied selectively
- Database schema supports complex queries

---

## 🚀 NPM Scripts

```json
{
  "start": "node rsi_one_backend/main.js",      // Start server
  "dev": "node --watch rsi_one_backend/main.js", // Auto-restart on changes
  "seed": "node database/seed.js"                // Populate test data
}
```

---

## 📦 Dependencies

### Core
- **express** - Web framework
- **@supabase/supabase-js** - Database & auth client
- **dotenv** - Environment variable management

### Security & Middleware
- **cors** - Cross-origin resource sharing
- **express-rate-limit** - API rate limiting
- **multer** - File upload handling

---

## 🎯 Quick Access

| Need to... | Go to... |
|------------|----------|
| Add new API endpoint | Create/edit in `routes/` and `controllers/` |
| Change database schema | Edit `database/schema.sql` |
| Modify authentication | Edit `middleware/auth.middleware.js` |
| Add new user role | Update `config/constants.js` and RLS policies |
| Configure Supabase | Edit `config/supabase.js` and `.env` |
| Add file upload endpoint | Use middleware from `upload.middleware.js` |
| Test APIs | See `API_TESTING.md` |
| Quick setup | Follow `QUICKSTART.md` |

---

**Well-organized, scalable, and production-ready! 🎉**
