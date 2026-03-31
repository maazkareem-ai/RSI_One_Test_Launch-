import multer from 'multer';
import { FILE_SIZE_LIMITS } from '../config/constants.js';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and HEIC are allowed.'), false);
  }
};

// File filter for documents
const documentFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/heic',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, images, Word, Excel, and CSV are allowed.'), false);
  }
};

// Image upload middleware
export const uploadImage = multer({
  storage,
  limits: { fileSize: FILE_SIZE_LIMITS.IMAGE },
  fileFilter: imageFilter
});

// Document upload middleware
export const uploadDocument = multer({
  storage,
  limits: { fileSize: FILE_SIZE_LIMITS.DOCUMENT },
  fileFilter: documentFilter
});

// CSV upload middleware
export const uploadCSV = multer({
  storage,
  limits: { fileSize: FILE_SIZE_LIMITS.CSV },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV files are allowed.'), false);
    }
  }
});

// Generic upload for all file types
export const uploadAny = multer({
  storage,
  limits: { fileSize: FILE_SIZE_LIMITS.DOCUMENT }
});
