import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

/**
 * Rate limiter middleware.
 */
export default (req: Request, res: Response, next: NextFunction) => {
  const requestRateLimiter = Container.get('rateLimiter.request');

  requestRateLimiter
    .attempt(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send('Too Many Requests');
    });
};
