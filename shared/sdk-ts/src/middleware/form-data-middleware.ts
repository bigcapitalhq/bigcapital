import type { Middleware } from 'openapi-typescript-fetch';

/**
 * Custom RequestInit property used to carry a `FormData` body past
 * openapi-typescript-fetch's request building. The library always
 * `JSON.stringify`s the payload for post/put/patch/delete and lets the
 * computed body override `init.body`, which would corrupt a `FormData`
 * instance into `"{}"`. Arbitrary properties on the per-call `init` survive
 * through `mergeRequestInit`/`getFetchParams` untouched, so the real
 * `FormData` reference rides along here until `createFormDataMiddleware`
 * swaps it back in as the actual body before `fetch` executes.
 */
export const FORM_DATA_INIT_KEY = 'formData';

/**
 * Middleware that turns a per-call `init[FORM_DATA_INIT_KEY]` FormData into
 * the real request body. Registered as the first middleware in the chain so
 * that downstream middlewares (notably the snake-case request middleware)
 * see a non-JSON content-type and skip their JSON body transform.
 *
 * The auto-set `content-type: application/json` header is deleted so the
 * browser sets `multipart/form-data; boundary=...` itself. The response is
 * left to the default fetcher pipeline, so the camelCase middleware still
 * transforms the JSON response and `ApiError` is thrown on failure —
 * keeping the same error shape as JSON endpoints.
 */
export function createFormDataMiddleware(): Middleware {
  return async (url, init, next) => {
    const formData = (init as Record<string, unknown>)[FORM_DATA_INIT_KEY];

    if (!(formData instanceof FormData)) {
      return next(url, init);
    }

    const headers = new Headers(init.headers);
    headers.delete('content-type');

    const { [FORM_DATA_INIT_KEY]: _omitted, ...rest } = init as Record<
      string,
      unknown
    >;
    return next(
      url,
      { ...rest, headers, body: formData } as typeof init,
    );
  };
}