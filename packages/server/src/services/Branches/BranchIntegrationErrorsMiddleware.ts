import { Request, Response, NextFunction } from 'express';
import { ServiceError } from '@/exceptions';

/**
 * Handles branches integration service errors.
 * @param {Error} error
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function BranchIntegrationErrorsMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ServiceError) {
    if (error.errorType === 'WAREHOUSE_ID_NOT_FOUND') {
      return res.boom.badRequest(null, {
        errors: [{ type: 'WAREHOUSE_ID_NOT_FOUND', code: 5000 }],
      });
    }
    if (error.errorType === 'BRANCH_ID_REQUIRED') {
      return res.boom.badRequest(null, {
        errors: [{ type: 'BRANCH_ID_REQUIRED', code: 5100 }],
      });
    }
    if (error.errorType === 'BRANCH_ID_NOT_FOUND') {
      return res.boom.badRequest(null, {
        errors: [{ type: 'BRANCH_ID_NOT_FOUND', code: 5300 }],
      });
    }
  }
  next(error);
}
