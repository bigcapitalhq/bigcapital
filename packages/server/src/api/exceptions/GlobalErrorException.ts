import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler.
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function GlobalErrorException(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);

  res.status(500);
  res.boom.badImplementation('', { stack: err.stack });
}
