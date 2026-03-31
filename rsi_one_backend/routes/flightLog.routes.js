import express from 'express';
import * as flightLogController from '../controllers/flightLog.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';
import { uploadCSV } from '../middleware/upload.middleware.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// Flight log CRUD
router.post('/', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.MANAGER, USER_ROLES.PILOT, USER_ROLES.RSI_ADMIN), 
  flightLogController.createFlightLog
);

router.get('/', 
  authenticateToken, 
  flightLogController.getAllFlightLogs
);

router.get('/:id', 
  authenticateToken, 
  flightLogController.getFlightLogById
);

router.put('/:id', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.MANAGER, USER_ROLES.PILOT, USER_ROLES.RSI_ADMIN), 
  flightLogController.updateFlightLog
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.MANAGER, USER_ROLES.RSI_ADMIN), 
  flightLogController.deleteFlightLog
);

// CSV upload
router.post('/upload-csv', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.MANAGER, USER_ROLES.RSI_ADMIN), 
  uploadCSV.single('file'), 
  flightLogController.uploadCSV
);

// Utilization
router.get('/utilization/stats', 
  authenticateToken, 
  flightLogController.getAssetUtilization
);

export default router;
