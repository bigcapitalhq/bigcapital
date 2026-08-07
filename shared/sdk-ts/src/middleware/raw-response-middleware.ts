import { ApiError } from 'openapi-typescript-fetch';
import type { ApiResponse, Middleware } from 'openapi-typescript-fetch';

/**
 * `Accept` header values that should be returned as a binary `Blob` rather than
 * parsed as text. The check is substring-based so it covers variants such as
 * `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.
 */
const BINARY_ACCEPT_MARKERS = [
  'application/octet-stream',
  'application/pdf',
  'application/xlsx',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument',
  'application/zip',
  'image/',
  'audio/',
  'video/',
];

/**
 * Returns true when the supplied `Accept` header indicates a binary response
 * (e.g. `application/xlsx`, `application/pdf`, `application/octet-stream`,
 * `image/*`). Used by the raw-response middleware to decide whether to parse
 * the body as a `Blob` or as `string`.
 */
function isBinaryAccept(accept: string): boolean {
  const lower = accept.toLowerCase();
  return BINARY_ACCEPT_MARKERS.some((marker) => lower.includes(marker));
}

/**
 * Creates a middleware that handles binary responses (files such as XLSX, PDF,
 * images, `application/octet-stream`, etc.) by performing the fetch directly
 * and returning the body as a `Blob`.
 *
 * The default `openapi-typescript-fetch` parser reads every non-JSON body as
 * UTF-8 text, which corrupts binary payloads. This middleware intercepts only
 * requests whose `Accept` header indicates a binary response and returns a
 * `Blob` so the bytes are preserved.
 *
 * JSON and text responses — including `application/json+html`,
 * `application/json+table`, `text/html`, `application/csv`, etc. — are
 * delegated to the default fetcher, which already returns them as parsed JSON
 * or `string` correctly. On non-OK responses the middleware throws an
 * `ApiError` so callers can handle failures using the same error shape they
 * use for JSON endpoints.
 */
export function createRawResponseMiddleware(): Middleware {
  return async (url, init, next): Promise<ApiResponse> => {
    const accept = init.headers.get('accept');

    // Only intercept binary responses; JSON and text go through the default fetcher.
    if (!accept || !isBinaryAccept(accept)) {
      return next(url, init);
    }

    const response = await fetch(url, init);

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new ApiError({
        url: response.url,
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
        data: errorBody,
      });
    }

    return {
      url: response.url,
      headers: response.headers,
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: await response.blob(),
    };
  };
}