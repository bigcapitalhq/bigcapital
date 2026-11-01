import type { Middleware } from 'openapi-typescript-fetch';
import { camelToSnakeCase, transformKeysToSnakeCase } from '../utils/case-transform';

/**
 * Sentinel header used by `withNestedQuery` to smuggle nested query objects
 * past openapi-typescript-fetch's primitive query serializer, which would
 * otherwise stringify them as the literal `[object Object]`.
 */
export const NESTED_QUERY_HEADER = 'x-sdk-nested-query';

const NESTED_PLACEHOLDER = '[object Object]';

function appendBracketKeys(
  params: URLSearchParams,
  rootKey: string,
  value: unknown,
): void {
  if (value === null || value === undefined) {
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      appendBracketKeys(params, `${rootKey}[]`, item);
    }
    return;
  }
  if (typeof value === 'object' && !(value instanceof Date) && !(value instanceof Blob)) {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      appendBracketKeys(params, `${rootKey}[${k}]`, v);
    }
    return;
  }
  params.append(rootKey, String(value));
}

export function createSnakeCaseRequestMiddleware(): Middleware {
  return async (url, init, next) => {
    const headers = new Headers(init.headers);

    let nested: Record<string, unknown> = {};
    const nestedRaw = headers.get(NESTED_QUERY_HEADER);
    if (nestedRaw) {
      try {
        nested = JSON.parse(decodeURIComponent(nestedRaw)) as Record<string, unknown>;
      } catch {
        nested = {};
      }
      headers.delete(NESTED_QUERY_HEADER);
    }

    const [base, search] = url.split('?');
    const newParams = new URLSearchParams();

    if (search) {
      const existing = new URLSearchParams(search);
      for (const [key, value] of existing.entries()) {
        // Drop the placeholder emitted by openapi-typescript-fetch for any
        // nested object passed as a query parameter — the real value is being
        // delivered via the sentinel header below.
        if (value === NESTED_PLACEHOLDER) continue;
        newParams.append(camelToSnakeCase(key), value);
      }
    }

    if (Object.keys(nested).length > 0) {
      const snakeCased = transformKeysToSnakeCase<Record<string, unknown>>(nested);
      for (const [k, v] of Object.entries(snakeCased)) {
        appendBracketKeys(newParams, k, v);
      }
    }

    const finalSearch = newParams.toString();
    const transformedUrl = finalSearch ? `${base}?${finalSearch}` : base;

    let transformedInit = { ...init, headers } as typeof init;
    const contentType = headers.get('content-type') ?? '';
    if (init.body && contentType.includes('application/json')) {
      const parsed = JSON.parse(init.body as string);
      transformedInit = {
        ...transformedInit,
        body: JSON.stringify(transformKeysToSnakeCase(parsed)),
      };
    }

    return next(transformedUrl, transformedInit);
  };
}
