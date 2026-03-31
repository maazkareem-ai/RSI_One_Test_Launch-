import dotenv from 'dotenv';
import { supabaseAdmin } from '../rsi_one_backend/config/supabase.js';

dotenv.config();

/**
 * Seed Script - Populates database with dummy data
 * Run: node database/seed.js
 */

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Step 1: Create test users
    console.log('📝 Creating test users...');
    const users = await createTestUsers();
    console.log(`✅ Created ${users.length} users\n`);

    // Step 2: Create assets
    console.log('🛩️  Creating assets...');
    const assets = await createAssets(users);
    console.log(`✅ Created ${assets.length} assets\n`);

    // Step 3: Create flight logs
    console.log('✈️  Creating flight logs...');
    const flightLogs = await createFlightLogs(assets, users);
    console.log(`✅ Created ${flightLogs.length} flight logs\n`);

    // Step 4: Create maintenance logs
    console.log('🔧 Creating maintenance logs...');
    const maintenanceLogs = await createMaintenanceLogs(assets, users);
    console.log(`✅ Created ${maintenanceLogs.length} maintenance logs\n`);

    // Step 5: Create expenses
    console.log('💰 Creating expenses...');
    const expenses = await createExpenses(assets, users);
    console.log(`✅ Created ${expenses.length} expenses\n`);

    // Step 6: Create processed documents
    console.log('📄 Creating processed documents...');
    const documents = await createDocuments(assets, users);
    console.log(`✅ Created ${documents.length} documents\n`);

    console.log('✨ Database seeding completed successfully!\n');
    console.log('Summary:');
    console.log(`  - Users: ${users.length}`);
    console.log(`  - Assets: ${assets.length}`);
    console.log(`  - Flight Logs: ${flightLogs.length}`);
    console.log(`  - Maintenance Logs: ${maintenanceLogs.length}`);
    console.log(`  - Expenses: ${expenses.length}`);
    console.log(`  - Documents: ${documents.length}`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

async function createTestUsers() {
  const testUsers = [
    { email: 'owner@rsi.com', password: 'Password123!', full_name: 'John Owner', role: 'owner', phone_number: '+1234567890' },
    { email: 'manager@rsi.com', password: 'Password123!', full_name: 'Jane Manager', role: 'manager', phone_number: '+1234567891' },
    { email: 'pilot@rsi.com', password: 'Password123!', full_name: 'Mike Pilot', role: 'pilot', phone_number: '+1234567892' },
    { email: 'admin@rsi.com', password: 'Password123!', full_name: 'Sarah Admin', role: 'rsi_admin', phone_number: '+1234567893' },
    { email: 'tech@rsi.com', password: 'Password123!', full_name: 'Tom Technician', role: 'technician', phone_number: '+1234567894' }
  ];

  const createdUsers = [];

  for (const user of testUsers) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          role: user.role
        }
      });

      if (authError) {
        console.log(`  ⚠️  User ${user.email} might already exist, skipping...`);
        // Try to fetch existing user
        const { data: existingUser } = await supabaseAdmin
          .from('user_profiles')
          .select('*')
          .eq('email', user.email)
          .single();
        
        if (existingUser) {
          createdUsers.push(existingUser);
        }
        continue;
      }

      // Create profile
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .insert([{
          id: authData.user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          phone_number: user.phone_number,
          is_active: true
        }])
        .select()
        .single();

      if (profileError) {
        console.error(`  ❌ Failed to create profile for ${user.email}:`, profileError.message);
        continue;
      }

      createdUsers.push(profile);
      console.log(`  ✓ Created: ${user.full_name} (${user.role})`);

    } catch (error) {
      console.error(`  ❌ Error creating user ${user.email}:`, error.message);
    }
  }

  return createdUsers;
}

async function createAssets(users) {
  const owner = users.find(u => u.role === 'owner');
  const manager = users.find(u => u.role === 'manager');

  const assetsData = [
    {
      asset_name: 'Gulfstream G650',
      asset_type: 'jet',
      model: 'G650ER',
      serial_number: 'SN-G650-001',
      registration_number: 'N123GS',
      manufacture_date: '2020-06-15',
      base_location_icao: 'KJFK',
      insurance_expiry: '2025-12-31',
      arc_expiry: '2025-06-30',
      cofa_expiry: '2026-12-31',
      description: 'Long-range business jet',
      total_flight_hours: 1250.5,
      total_cycles: 450,
      owner_id: owner?.id,
      created_by: manager?.id
    },
    {
      asset_name: 'Cessna Citation X',
      asset_type: 'jet',
      model: 'Citation X+',
      serial_number: 'SN-CIT-X-002',
      registration_number: 'N456CX',
      manufacture_date: '2019-03-22',
      base_location_icao: 'KLAX',
      insurance_expiry: '2025-11-30',
      arc_expiry: '2025-05-15',
      cofa_expiry: '2026-11-30',
      description: 'Fast business jet',
      total_flight_hours: 890.25,
      total_cycles: 320,
      owner_id: owner?.id,
      created_by: manager?.id
    },
    {
      asset_name: 'King Air 350',
      asset_type: 'turboprop',
      model: 'B350i',
      serial_number: 'SN-KA-350-003',
      registration_number: 'N789KA',
      manufacture_date: '2021-08-10',
      base_location_icao: 'KORD',
      insurance_expiry: '2025-10-31',
      arc_expiry: '2025-08-10',
      cofa_expiry: '2026-08-10',
      description: 'Versatile turboprop aircraft',
      total_flight_hours: 560.75,
      total_cycles: 210,
      owner_id: owner?.id,
      created_by: manager?.id
    },
    {
      asset_name: 'Bell 429',
      asset_type: 'helicopter',
      model: '429 GlobalRanger',
      serial_number: 'SN-BELL-429-004',
      registration_number: 'N321BH',
      manufacture_date: '2022-01-15',
      base_location_icao: 'KMIA',
      insurance_expiry: '2025-12-15',
      arc_expiry: '2025-07-15',
      cofa_expiry: '2026-01-15',
      description: 'Light twin helicopter',
      total_flight_hours: 340.5,
      total_cycles: 180,
      owner_id: owner?.id,
      created_by: manager?.id
    },
    {
      asset_name: 'Azimut 72',
      asset_type: 'yacht',
      model: 'Azimut 72 Flybridge',
      serial_number: 'SN-AZ-72-005',
      registration_number: 'YT-AZ72',
      manufacture_date: '2021-05-20',
      base_location_icao: 'KMIA',
      insurance_expiry: '2025-12-31',
      description: 'Luxury motor yacht',
      owner_id: owner?.id,
      created_by: manager?.id
    }
  ];

  const { data, error } = await supabaseAdmin
    .from('assets')
    .insert(assetsData)
    .select();

  if (error) {
    console.error('Error creating assets:', error);
    return [];
  }

  return data;
}

async function createFlightLogs(assets, users) {
  const pilot = users.find(u => u.role === 'pilot');
  const aircraftAssets = assets.filter(a => ['jet', 'turboprop', 'helicopter'].includes(a.asset_type));

  const flightLogsData = [];
  
  aircraftAssets.forEach(asset => {
    // Create 10 flight logs per aircraft
    for (let i = 0; i < 10; i++) {
      const daysAgo = Math.floor(Math.random() * 60) + 1;
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      flightLogsData.push({
        asset_id: asset.id,
        pilot_id: pilot?.id,
        flight_date: date.toISOString().split('T')[0],
        departure_icao: getRandomICAO(),
        arrival_icao: getRandomICAO(),
        flight_hours: parseFloat((Math.random() * 5 + 1).toFixed(2)),
        cycles: 1,
        fuel_consumed: parseFloat((Math.random() * 500 + 100).toFixed(2)),
        notes: `Flight #${i + 1} - Routine operation`,
        created_by: pilot?.id
      });
    }
  });

  const { data, error } = await supabaseAdmin
    .from('flight_logs')
    .insert(flightLogsData)
    .select();

  if (error) {
    console.error('Error creating flight logs:', error);
    return [];
  }

  return data;
}

async function createMaintenanceLogs(assets, users) {
  const technician = users.find(u => u.role === 'technician');
  const aircraftAssets = assets.filter(a => ['jet', 'turboprop', 'helicopter'].includes(a.asset_type));

  const maintenanceTypes = ['a_check', 'c_check', 'service_bulletin', 'airworthiness_directive', 'unscheduled'];
  const maintenanceLogsData = [];

  aircraftAssets.forEach(asset => {
    // Create 5 maintenance logs per aircraft
    for (let i = 0; i < 5; i++) {
      const daysAgo = Math.floor(Math.random() * 90) + 1;
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 180) + 30);

      maintenanceLogsData.push({
        asset_id: asset.id,
        maintenance_type: maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)],
        maintenance_date: date.toISOString().split('T')[0],
        flight_hours_at_maintenance: parseFloat((asset.total_flight_hours - Math.random() * 100).toFixed(2)),
        cycles_at_maintenance: Math.floor(asset.total_cycles - Math.random() * 50),
        next_due_hours: parseFloat((asset.total_flight_hours + Math.random() * 200 + 50).toFixed(2)),
        next_due_cycles: Math.floor(asset.total_cycles + Math.random() * 100 + 25),
        next_due_date: futureDate.toISOString().split('T')[0],
        components_replaced: 'Filters, spark plugs, hydraulic fluid',
        technician_name: 'Tom Technician',
        technician_license: `A&P-${Math.floor(Math.random() * 90000) + 10000}`,
        cost: parseFloat((Math.random() * 5000 + 500).toFixed(2)),
        vendor: ['Aviation Services Inc', 'Sky Maintenance', 'AeroTech Solutions'][Math.floor(Math.random() * 3)],
        description: `Scheduled maintenance inspection`,
        created_by: technician?.id
      });
    }
  });

  const { data, error } = await supabaseAdmin
    .from('maintenance_logs')
    .insert(maintenanceLogsData)
    .select();

  if (error) {
    console.error('Error creating maintenance logs:', error);
    return [];
  }

  return data;
}

async function createExpenses(assets, users) {
  const manager = users.find(u => u.role === 'manager');
  const categories = ['maintenance', 'fuel', 'insurance', 'crew', 'hangar', 'miscellaneous'];
  const vendors = ['Aviation Services Inc', 'Sky Fuel Co', 'AeroInsurance Ltd', 'Hangar Solutions', 'Tech Support'];
  
  const expensesData = [];

  assets.forEach(asset => {
    // Create 8 expenses per asset
    for (let i = 0; i < 8; i++) {
      const daysAgo = Math.floor(Math.random() * 90) + 1;
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      expensesData.push({
        asset_id: asset.id,
        expense_date: date.toISOString().split('T')[0],
        vendor: vendors[Math.floor(Math.random() * vendors.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        amount: parseFloat((Math.random() * 8000 + 500).toFixed(2)),
        currency: 'USD',
        invoice_number: `INV-${Math.floor(Math.random() * 900000) + 100000}`,
        description: 'Regular operational expense',
        payment_method: ['Credit Card', 'Bank Transfer', 'Check'][Math.floor(Math.random() * 3)],
        is_flagged: Math.random() > 0.9, // 10% flagged
        flag_reason: Math.random() > 0.9 ? 'Amount exceeds average' : null,
        created_by: manager?.id
      });
    }
  });

  const { data, error } = await supabaseAdmin
    .from('expenses')
    .insert(expensesData)
    .select();

  if (error) {
    console.error('Error creating expenses:', error);
    return [];
  }

  return data;
}

async function createDocuments(assets, users) {
  const manager = users.find(u => u.role === 'manager');
  const documentTypes = ['invoice', 'maintenance_report', 'certificate', 'manual'];
  const statuses = ['approved', 'pending_review', 'rejected'];

  const documentsData = [];

  assets.slice(0, 3).forEach(asset => {
    // Create 3 documents per asset (for first 3 assets)
    for (let i = 0; i < 3; i++) {
      const docType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
      
      documentsData.push({
        file_name: `${docType}_${asset.registration_number}_${i + 1}.pdf`,
        file_type: 'application/pdf',
        file_size: Math.floor(Math.random() * 2000000) + 100000,
        storage_path: `ocr/${docType}/${Date.now()}-${i}.pdf`,
        document_type: docType,
        asset_id: asset.id,
        extracted_data: {
          vendor: 'Sample Aviation Services',
          amount: (Math.random() * 5000 + 500).toFixed(2),
          currency: 'USD',
          date: new Date().toISOString().split('T')[0],
          invoice_number: `INV-${Math.floor(Math.random() * 100000)}`,
          confidence: 0.85
        },
        confidence_score: parseFloat((Math.random() * 0.3 + 0.7).toFixed(2)),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        processed_by: manager?.id,
        uploaded_by: manager?.id,
        approved_by: Math.random() > 0.5 ? manager?.id : null,
        approved_at: Math.random() > 0.5 ? new Date().toISOString() : null
      });
    }
  });

  const { data, error } = await supabaseAdmin
    .from('processed_documents')
    .insert(documentsData)
    .select();

  if (error) {
    console.error('Error creating documents:', error);
    return [];
  }

  return data;
}

function getRandomICAO() {
  const icaoCodes = ['KJFK', 'KLAX', 'KORD', 'KMIA', 'KATL', 'KDFW', 'KDEN', 'KSEA', 'KBOS', 'KSFO'];
  return icaoCodes[Math.floor(Math.random() * icaoCodes.length)];
}

// Run the seed
seedDatabase();
