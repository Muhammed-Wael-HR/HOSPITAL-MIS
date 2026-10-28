// =============================================================
// Auth Service
// Business logic for authentication operations
// =============================================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

/**
 * Authenticate user with username and password
 * Returns JWT access and refresh tokens on success
 */
export const login = async (username: string, password: string) => {
  // Find user by username
  const user = await prisma.user.findUnique({
    where: { username },
    include: { employee: true },
  });

  if (!user) {
    throw new AppError('Invalid username or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated. Contact administrator.', 403);
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw new AppError('Invalid username or password', 401);
  }

  // Generate tokens
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'default-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'default-refresh-secret', {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  } as jwt.SignOptions);

  return {
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      employeeId: user.employeeId,
      employeeName: user.employee?.fullNameAr || null,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Refresh access token using a valid refresh token
 */
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'default-refresh-secret'
    ) as { id: number; username: string; role: string };

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || !user.isActive) {
      throw new AppError('User not found or deactivated', 401);
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'default-secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    } as jwt.SignOptions);

    return { accessToken };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Invalid refresh token', 401);
  }
};

/**
 * Get current user profile with employee details
 */
export const getCurrentUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      role: true,
      isActive: true,
      employeeId: true,
      employee: {
        select: {
          id: true,
          fullNameAr: true,
          fullNameEn: true,
          phone: true,
          email: true,
          position: true,
          departmentName: true,
        },
      },
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

/**
 * Change user password
 */
export const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Hash new password and update
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: hashedPassword },
  });

  return { message: 'Password changed successfully' };
};
