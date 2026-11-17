import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ThrottlerOptions } from '@nestjs/throttler';

const AUTH_THROTTLE_ROUTE = 'AUTH_THROTTLE_ROUTE';
const reflector = new Reflector();

/**
 * Marks a controller or a route for the stricter "auth" throttler.
 */
export const AuthThrottle = () => SetMetadata(AUTH_THROTTLE_ROUTE, true);

const isAuthThrottledRoute = (context: ExecutionContext): boolean =>
  reflector.getAllAndOverride<boolean>(AUTH_THROTTLE_ROUTE, [
    context.getHandler(),
    context.getClass(),
  ]) === true;

export interface AppThrottleLimits {
  globalTtl: number;
  globalLimit: number;
  authTtl: number;
  authLimit: number;
}

/**
 * The app's named throttlers: "default" for every route, "auth" for the
 * routes marked with `@AuthThrottle()`.
 *
 * The global ThrottlerGuard applies every named throttler to every route
 * unless that throttler skips it, so "auth" must skip unmarked routes.
 * (`@Throttle({ auth: {} })` doesn't restrict it: it only overrides options.)
 */
export const getAppThrottlers = (
  limits: AppThrottleLimits,
): ThrottlerOptions[] => [
  { name: 'default', ttl: limits.globalTtl, limit: limits.globalLimit },
  {
    name: 'auth',
    ttl: limits.authTtl,
    limit: limits.authLimit,
    skipIf: (context) => !isAuthThrottledRoute(context),
  },
];
