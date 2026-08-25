import { Fetcher } from 'openapi-typescript-fetch';
import type { paths } from './schema';
import { createCamelCaseMiddleware } from './middleware/camel-case-middleware';
import {
  createSnakeCaseRequestMiddleware,
  NESTED_QUERY_HEADER,
} from './middleware/snake-case-request-middleware';
import { createErrorReporterMiddleware } from './middleware/error-reporter-middleware';
import { createRawResponseMiddleware } from './middleware/raw-response-middleware';
import {
  FORM_DATA_INIT_KEY,
  createFormDataMiddleware,
} from './middleware/form-data-middleware';

/**
 * Splits a query object into a primitive-only payload and a per-call `init`
 * carrying any nested object or array values via the SDK's sentinel header.
 * The snake-case request middleware reads that header and re-serializes the
 * nested values as bracket-style query params (`number_format[no_cents]=true`,
 * `items_ids[]=1003`) so Express's `extended` qs parser can reconstruct them
 * server-side.
 *
 * openapi-typescript-fetch's built-in query serializer calls `String(value)`,
 * which would otherwise turn nested objects into the literal `[object Object]`.
 * Arrays are routed the same way so that a single-element array is emitted as
 * `key[]=value` instead of a bare scalar, which `qs` would parse as a string
 * rather than an array.
 */
export function withNestedQuery<T>(
  query: T,
): { payload: T; init?: RequestInit } {
  const sanitized: Record<string, unknown> = {};
  const nested: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(query as Record<string, unknown>)) {
    if (
      value !== null &&
      typeof value === 'object' &&
      !(value instanceof Date) &&
      !(value instanceof Blob)
    ) {
      nested[key] = value;
    } else {
      sanitized[key] = value;
    }
  }

  if (Object.keys(nested).length === 0) {
    return { payload: sanitized as T };
  }
  return {
    payload: sanitized as T,
    init: {
      headers: {
        [NESTED_QUERY_HEADER]: encodeURIComponent(JSON.stringify(nested)),
      },
    },
  };
}

/**
 * Attaches a `FormData` body to a per-call RequestInit via a custom property
 * that survives openapi-typescript-fetch's init merging (its computed JSON
 * body always overrides `init.body`). The form-data middleware swaps it back
 * in as the real body before `fetch` executes, so the request still flows
 * through the full middleware pipeline (snake-case request, camelCase
 * response, error reporter, etc.). Pass the returned init as the second
 * argument to the generated typed fetcher:
 *
 *   fetcher.path('/api/...').method('post').create()({}, withFormData(fd));
 */
export function withFormData(
  formData: FormData,
  init?: RequestInit,
): RequestInit {
  return {
    ...(init ?? {}),
    [FORM_DATA_INIT_KEY]: formData,
  } as RequestInit;
}

export type ApiFetcher = ReturnType<typeof Fetcher.for<paths>>;

export interface CreateApiFetcherConfig {
  baseUrl?: string;
  init?: RequestInit;
  /** Set to true to disable automatic snake_case to camelCase transformation on responses */
  disableCamelCaseTransform?: boolean;
  /** Set to true to disable automatic camelCase to snake_case transformation on requests */
  disableSnakeCaseTransform?: boolean;
  /** Invoked with the rejection from any failed request, after which the error is re-thrown. Use for global side effects like surfacing toasts or triggering logout. */
  onError?: (error: unknown) => void;
}

/**
 * Creates and configures an ApiFetcher for use with sdk-ts fetch functions.
 * Call this with baseUrl (e.g. '/api') and init.headers (Authorization, organization-id, etc.) from the app.
 *
 * By default, all JSON response keys are automatically transformed from snake_case to camelCase.
 * Set disableCamelCaseTransform: true to disable this behavior.
 */
export function createApiFetcher(config?: CreateApiFetcherConfig): ApiFetcher {
  const parsedConfig = {
    baseUrl: '',
    disableCamelCaseTransform: true,
    disableSnakeCaseTransform: false,
    ...config,
  };
  const fetcher = Fetcher.for<paths>();
  fetcher.configure({
    baseUrl: parsedConfig.baseUrl,
    init: parsedConfig?.init,
    use: [
      createFormDataMiddleware(),
      ...(parsedConfig.disableSnakeCaseTransform ? [] : [createSnakeCaseRequestMiddleware()]),
      ...(parsedConfig.disableCamelCaseTransform ? [] : [createCamelCaseMiddleware()]),
      ...(parsedConfig.onError ? [createErrorReporterMiddleware(parsedConfig.onError)] : []),
      createRawResponseMiddleware(),
    ],
  });

  // Expose the runtime config so manual helpers (rawRequest) can read the
  // configured baseUrl and default headers (Authorization, organization-id).
  (fetcher as FetcherWithConfig).config = {
    baseUrl: parsedConfig.baseUrl,
    init: parsedConfig.init,
  };

  return fetcher;
}

/**
 * Strips leading slash from a path segment to avoid double slashes when joining with a base (e.g. `/api/` + path).
 */
export function normalizeApiPath(path: string): string {
  return (path || '').replace(/^\//, '');
}

/**
 * Fetcher configuration as exposed by `openapi-typescript-fetch` at runtime.
 * The library does not surface this in its public types, so we declare the
 * shape we depend on in one place rather than re-asserting it at each call site.
 */
interface FetcherRuntimeConfig {
  baseUrl: string;
  init?: RequestInit;
}

interface FetcherWithConfig {
  config?: FetcherRuntimeConfig;
}

function getFetcherConfig(fetcher: ApiFetcher): FetcherRuntimeConfig {
  const config = (fetcher as FetcherWithConfig).config;
  return {
    baseUrl: config?.baseUrl ?? '',
    init: config?.init,
  };
}

/**
 * Makes a raw API request using the fetcher's configuration (baseUrl, headers, middleware).
 * Use this for endpoints not defined in the OpenAPI schema.
 */
export async function rawRequest<T = unknown>(
  fetcher: ApiFetcher,
  method: string,
  path: string,
  body?: Record<string, unknown>,
  headers?: Record<string, string>
): Promise<T> {
  const { baseUrl, init } = getFetcherConfig(fetcher);

  const url = `${baseUrl}${path}`;
  const mergedHeaders: Record<string, string> = {
    'Accept': 'application/json',
    ...((init?.headers as Record<string, string> | undefined) ?? {}),
    ...(headers ?? {}),
  };

  const requestInit: RequestInit = {
    ...init,
    method,
    headers: mergedHeaders,
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    mergedHeaders['Content-Type'] = 'application/json';
    requestInit.body = JSON.stringify(body);
  }

  const response = await fetch(url, requestInit);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}
