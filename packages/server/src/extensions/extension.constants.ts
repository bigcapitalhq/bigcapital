/**
 * Token that provides the list of validated extensions compiled into the host.
 */
export const EXTENSIONS_TOKEN = Symbol('BIGCAPITAL_EXTENSIONS');

/**
 * Token that provides the normalized extension module options.
 */
export const EXTENSION_OPTIONS_TOKEN = Symbol('BIGCAPITAL_EXTENSION_OPTIONS');

/**
 * How long a tenant enablement result is cached in memory.
 */
export const EXTENSION_ENABLEMENT_CACHE_TTL_MS = 30_000;

/**
 * Upper bound for the in-memory enablement cache.
 */
export const EXTENSION_ENABLEMENT_CACHE_MAX_ENTRIES = 10_000;

/**
 * Default timeout for extension event handlers.
 */
export const EXTENSION_EVENT_TIMEOUT_MS = 5_000;

/**
 * Prefix used by extension HTTP routes, including the global `/api` prefix.
 */
export const EXTENSION_ROUTE_PREFIX = '/api/ext/';
