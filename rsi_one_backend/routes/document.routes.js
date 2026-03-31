import express from 'express';
import * as documentController from '../controllers/document.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';
import { uploadDocument } from '../middleware/upload.middleware.js';
import { uploadLimiter } from '../middleware/rateLimiter.middleware.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// Document processing
router.post('/process', 
  authenticateToken, 
  uploadLimiter,
  uploadDocument.single('file'), 
  documentController.processDocument
);

router.get('/', 
  authenticateToken, 
  documentController.getAllDocuments
);

router.get('/:id', 
  authenticateToken, 
  documentController.getDocumentById
);

// Document approval workflow
router.post('/:id/approve', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.MANAGER, USER_ROLES.OWNER, USER_ROLES.RSI_ADMIN), 
  documentController.approveDocument
);

router.post('/:id/reject', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.MANAGER, USER_ROLES.OWNER, USER_ROLES.RSI_ADMIN), 
  documentController.rejectDocument
);

export default router;
