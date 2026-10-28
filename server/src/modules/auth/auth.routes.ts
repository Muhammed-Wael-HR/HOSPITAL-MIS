// =============================================================
// Auth Routes
// Authentication endpoint definitions
// =============================================================

import { Router } from 'express';
import * as authController from './auth.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

// Public routes
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

// Protected routes
router.get('/me', authenticate, authController.me);
router.post('/change-password', authenticate, authController.changePassword);

export default router;
