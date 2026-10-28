// =============================================================
// Authentication & Authorization Middleware
// JWT token validation and role-based access control
// =============================================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { AppError } from './errorHandler.js';

/**
 * Extended Express Request interface to include authenticated user data
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: UserRole;
  };
}

// Extend Express Request type globally
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        role: UserRole;
      };
    }
  }
}

/**
 * JWT token payload structure
 */
interface JwtPayload {
  id: number;
  username: string;
  role: UserRole;
}

/**
 * Authentication middleware
 * Validates Bearer token from Authorization header
 * Extracts user info and attaches to req.user
 */
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('Access denied. Invalid token format.', 401);
    }

    const secret = process.env.JWT_SECRET || 'default-secret';
    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token.', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired.', 401));
    } else {
      next(new AppError('Authentication failed.', 401));
    }
  }
};

/**
 * Authorization middleware factory
 * Checks if authenticated user has one of the allowed roles
 * @param roles - Array of allowed UserRole values
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Access denied. Not authenticated.', 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(
        new AppError(
          `Access denied. Required roles: ${roles.join(', ')}. Your role: ${req.user.role}`,
          403
        )
      );
      return;
    }

    next();
  };
};

export default { authenticate, authorize };
