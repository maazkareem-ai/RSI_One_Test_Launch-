import express from 'express';
import * as expenseController from '../controllers/expense.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';
import { uploadDocument } from '../middleware/upload.middleware.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// Expense CRUD
router.post('/', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.MANAGER, USER_ROLES.OWNER, USER_ROLES.RSI_ADMIN), 
  expenseController.createExpense
);

router.get('/', 
  authenticateToken, 
  expenseController.getAllExpenses
);

router.get('/summary', 
  authenticateToken, 
  expenseController.getExpenseSummary
);

router.get('/duplicates', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.MANAGER, USER_ROLES.RSI_ADMIN), 
  expenseController.detectDuplicates
);

router.get('/:id', 
  authenticateToken, 
  expenseController.getExpenseById
);

router.put('/:id', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.MANAGER, USER_ROLES.OWNER, USER_ROLES.RSI_ADMIN), 
  expenseController.updateExpense
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(USER_ROLES.MANAGER, USER_ROLES.RSI_ADMIN), 
  expenseController.deleteExpense
);

// Attachments
router.post('/:id/attachments', 
  authenticateToken, 
  uploadDocument.single('file'), 
  expenseController.uploadExpenseAttachment
);

export default router;
