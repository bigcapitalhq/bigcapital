import RateLimiter from '@/services/Authentication/RateLimiter';
import { Container } from 'typedi';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import config from '@/config';

export default () => {
  const rateLimiterRequestsMemory = new RateLimiterMemory({
    points: config.throttler.requests.points,
    duration: config.throttler.requests.duration,
    blockDuration: config.throttler.requests.blockDuration,
  });
  const rateLimiterMemoryLogin = new RateLimiterMemory({
    points: config.throttler.login.points,
    duration: config.throttler.login.duration,
    blockDuration: config.throttler.login.blockDuration,
  });

  const rateLimiterRequest = new RateLimiter(rateLimiterRequestsMemory);
  const rateLimiterLogin = new RateLimiter(rateLimiterMemoryLogin)

  // Inject the rate limiter of the global requests and login into the container.
  Container.set('rateLimiter.request', rateLimiterRequest);
  Container.set('rateLimiter.login', rateLimiterLogin);
};