// =============================================================
// Auth Controller
// Request handlers for authentication endpoints
// =============================================================

import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.js';
import { createAuditLog, getClientIp } from '../../middleware/auditLog.js';

/**
 * POST /api/v1/auth/login
 * Authenticate user and return JWT tokens
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ success: false, message: 'Username and password are required' });
      return;
    }

    const result = await authService.login(username, password);

    // Log the login action
    await createAuditLog({
      userId: result.user.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: result.user.id,
      ipAddress: getClientIp(req),
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/refresh
 * Refresh access token using refresh token
 */
export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ success: false, message: 'Refresh token is required' });
      return;
    }

    const result = await authService.refreshAccessToken(refreshToken);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/auth/me
 * Get current authenticated user profile
 */
export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const user = await authService.getCurrentUser(userId);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/change-password
 * Change current user's password
 */
export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Current and new passwords are required' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
      return;
    }

    const result = await authService.changePassword(userId, currentPassword, newPassword);

    await createAuditLog({
      userId,
      action: 'CHANGE_PASSWORD',
      entity: 'User',
      entityId: userId,
      ipAddress: getClientIp(req),
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
