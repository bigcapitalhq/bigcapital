import { NextFunction, Request, Response } from 'express';
import { ServiceError } from '@/exceptions';

/**
 * Handles service error exception.
 * @param {Error | ServiceError} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function ServiceErrorException(
  err: Error | ServiceError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ServiceError) {
    res.boom.badRequest('', {
      errors: [{ type: err.errorType, message: err.message }],
      type: 'ServiceError',
    });
  } else {
    next(err);
  }
}
