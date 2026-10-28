// =============================================================
// Audit Log Utility
// Creates audit trail entries for tracking user actions
// =============================================================

import prisma from '../config/prisma.js';

/**
 * Parameters for creating an audit log entry
 */
interface AuditLogParams {
  userId: number;
  action: string;
  entity: string;
  entityId?: number;
  details?: Record<string, unknown>;
  ipAddress?: string;
}

/**
 * Creates an audit log entry in the database
 * Used to track all significant user actions for compliance and debugging
 *
 * @param params - Audit log parameters
 */
export const createAuditLog = async (params: AuditLogParams): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        details: params.details ? params.details : undefined,
        ipAddress: params.ipAddress,
      },
    });
  } catch (error) {
    // Don't throw - audit log failures should not break the main operation
    console.error('Failed to create audit log:', error);
  }
};

/**
 * Helper to extract IP address from request
 */
export const getClientIp = (req: { ip?: string; headers: Record<string, string | string[] | undefined> }): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || 'unknown';
};

export default { createAuditLog, getClientIp };
