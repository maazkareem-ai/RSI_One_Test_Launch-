import express from 'express';
import * as assetController from '../controllers/asset.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';
import { uploadDocument } from '../middleware/upload.middleware.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// Asset CRUD
router.post('/', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.OWNER, USER_ROLES.MANAGER, USER_ROLES.RSI_ADMIN), 
  assetController.createAsset
);

router.get('/', 
  authenticateToken, 
  assetController.getAllAssets
);

router.get('/:id', 
  authenticateToken, 
  assetController.getAssetById
);

router.put('/:id', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.OWNER, USER_ROLES.MANAGER, USER_ROLES.RSI_ADMIN), 
  assetController.updateAsset
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.OWNER, USER_ROLES.RSI_ADMIN), 
  assetController.deleteAsset
);

// Attachments
router.post('/:id/attachments', 
  authenticateToken, 
  uploadDocument.single('file'), 
  assetController.uploadAttachment
);

router.get('/:id/attachments', 
  authenticateToken, 
  assetController.getAttachments
);

router.get('/attachments/:attachmentId/download', 
  authenticateToken, 
  assetController.downloadAttachment
);

router.delete('/attachments/:attachmentId', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.OWNER, USER_ROLES.MANAGER, USER_ROLES.RSI_ADMIN), 
  assetController.deleteAttachment
);

// Reminders
router.get('/:id/reminders', 
  authenticateToken, 
  assetController.getReminders
);

export default router;
