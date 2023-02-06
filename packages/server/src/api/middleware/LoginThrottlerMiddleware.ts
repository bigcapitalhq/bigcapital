import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import config from '@/config';

const MAX_CONSECUTIVE_FAILS = config.throttler.login.points;

export default async (req: Request, res: Response, next: NextFunction) => {
  const { crediential } = req.body;
  const loginThrottler = Container.get('rateLimiter.login');

  // Retrieve the rate limiter response of the given crediential.
  const emailRateRes = await loginThrottler.get(crediential);

  if (emailRateRes !== null && emailRateRes.consumedPoints >= MAX_CONSECUTIVE_FAILS) {
    const retrySecs = Math.round(emailRateRes.msBeforeNext / 1000) || 1;

    res.set('Retry-After', retrySecs);
    res.status(429).send({
      errors: [{ type: 'LOGIN_TO_MANY_ATTEMPTS', code: 400 }],
    });
  } else {
    next();
  }
}