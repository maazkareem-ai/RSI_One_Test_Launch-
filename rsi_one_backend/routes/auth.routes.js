import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.middleware.js';
import { validateSignup, validateLogin } from '../middleware/validation.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', authLimiter, validateSignup, authController.register);
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password', authLimiter, authController.resetPassword);

// Protected routes
router.post('/logout', authenticateToken, authController.logout);
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
router.get('/activity-logs', authenticateToken, authController.getActivityLogs);
router.delete('/account', authenticateToken, authController.deleteUser);

export default router;
