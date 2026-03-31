export const USER_ROLES = {
  OWNER: 'owner',
  MANAGER: 'manager',
  PILOT: 'pilot',
  RSI_ADMIN: 'rsi_admin',
  TECHNICIAN: 'technician'
};

export const ASSET_TYPES = {
  JET: 'jet',
  TURBOPROP: 'turboprop',
  HELICOPTER: 'helicopter',
  YACHT: 'yacht'
};

export const MAINTENANCE_TYPES = {
  A_CHECK: 'a_check',
  C_CHECK: 'c_check',
  SB: 'service_bulletin',
  AD: 'airworthiness_directive',
  UNSCHEDULED: 'unscheduled'
};

export const DOCUMENT_TYPES = {
  MANUAL: 'manual',
  CERTIFICATE: 'certificate',
  IMAGE: 'image',
  PDF: 'pdf',
  EXCEL: 'excel',
  WORD: 'word',
  INVOICE: 'invoice'
};

export const EXPENSE_CATEGORIES = {
  MAINTENANCE: 'maintenance',
  FUEL: 'fuel',
  INSURANCE: 'insurance',
  CREW: 'crew',
  HANGAR: 'hangar',
  MISC: 'miscellaneous'
};

export const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
};

export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  CSV: 2 * 1024 * 1024 // 2MB
};
