// =============================================================
// Zod Validation Middleware
// Validates request body, query, and params against Zod schemas
// =============================================================

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './errorHandler.js';

/**
 * Validation target - which part of the request to validate
 */
type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Validation middleware factory
 * Creates a middleware that validates the specified request property
 * against the provided Zod schema
 *
 * @param schema - Zod schema to validate against
 * @param target - Which part of the request to validate (default: 'body')
 */
export const validate = (schema: ZodSchema, target: ValidationTarget = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[target]);
      // Replace the request data with the parsed (and possibly transformed) data
      req[target] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        next(
          new AppError(
            `Validation failed: ${formattedErrors.map((e) => `${e.field}: ${e.message}`).join(', ')}`,
            400
          )
        );
      } else {
        next(error);
      }
    }
  };
};

export default validate;
