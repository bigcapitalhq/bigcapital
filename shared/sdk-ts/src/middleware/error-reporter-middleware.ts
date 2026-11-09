import type { Middleware } from 'openapi-typescript-fetch';

/**
 * Middleware that forwards every rejected request to the supplied `report`
 * callback, then re-throws the original error so existing caller-side
 * `.catch` handlers continue to run. The callback is responsible for any
 * side effects (e.g. surfacing global toasts, dispatching auth/logout flow);
 * it must not throw.
 */
export function createErrorReporterMiddleware(
  report: (err: unknown) => void,
): Middleware {
  return async (url, init, next) => {
    try {
      return await next(url, init);
    } catch (err) {
      report(err);
      throw err;
    }
  };
}
