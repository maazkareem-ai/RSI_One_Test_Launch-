import express from 'express';
import * as maintenanceController from '../controllers/maintenance.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// Maintenance log CRUD
router.post('/', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.MANAGER, USER_ROLES.TECHNICIAN, USER_ROLES.RSI_ADMIN), 
  maintenanceController.createMaintenanceLog
);

router.get('/', 
  authenticateToken, 
  maintenanceController.getAllMaintenanceLogs
);

router.get('/overdue', 
  authenticateToken, 
  maintenanceController.getOverdueMaintenance
);

router.get('/upcoming', 
  authenticateToken, 
  maintenanceController.getUpcomingMaintenance
);

router.get('/:id', 
  authenticateToken, 
  maintenanceController.getMaintenanceLogById
);

router.put('/:id', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.MANAGER, USER_ROLES.TECHNICIAN, USER_ROLES.RSI_ADMIN), 
  maintenanceController.updateMaintenanceLog
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.MANAGER, USER_ROLES.RSI_ADMIN), 
  maintenanceController.deleteMaintenanceLog
);

// AI Predictions
router.get('/:asset_id/predict', 
  authenticateToken, 
  maintenanceController.predictMaintenance
);

export default router;
