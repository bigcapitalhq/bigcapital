import { EXTENSION_ID_PATTERN } from './constants';

/**
 * Maximum number of characters taken from the sanitized extension id before
 * the stable hash suffix. Keeps MySQL identifiers under the 64-character limit
 * even for the longest generated table name (`ext_migrations_<slug>`).
 */
const SLUG_BASE_MAX_LENGTH = 32;

/**
 * Delimiter used by every namespaced extension concern.
 */
const SEPARATOR = ':';

export function assertValidExtensionId(extensionId: string): void {
  if (!EXTENSION_ID_PATTERN.test(extensionId)) {
    throw new Error(
      `Invalid extension id "${extensionId}". Expected a lower-case identifier such as "acme.reports".`,
    );
  }
}

/**
 * Feature key owned by an extension.
 *
 * Example: `ext:acme.reports:revenue-by-customer`
 */
export function extensionFeatureKey(extensionId: string, key: string): string {
  return `ext${SEPARATOR}${extensionId}${SEPARATOR}${key}`;
}

/**
 * CASL subject owned by an extension.
 *
 * Example: `ext:acme.reports:Report`
 */
export function extensionSubject(extensionId: string, subject: string): string {
  return `ext${SEPARATOR}${extensionId}${SEPARATOR}${subject}`;
}

/**
 * Settings group owned by an extension.
 *
 * Example: `ext:acme.reports`
 */
export function extensionSettingsGroup(extensionId: string): string {
  return `ext${SEPARATOR}${extensionId}`;
}

/**
 * Bull/BullMQ job or queue name owned by an extension.
 */
export function extensionJobName(extensionId: string, jobName: string): string {
  return `ext${SEPARATOR}${extensionId}${SEPARATOR}${jobName}`;
}

/**
 * Socket.io event owned by an extension.
 */
export function extensionSocketEvent(
  extensionId: string,
  eventName: string,
): string {
  return `ext${SEPARATOR}${extensionId}${SEPARATOR}${eventName}`;
}

/**
 * Server route prefix owned by an extension (without the global `/api` prefix).
 */
export function extensionRoutePrefix(extensionId: string): string {
  return `ext/${extensionId}`;
}

/**
 * Web route prefix owned by an extension.
 */
export function extensionWebRoutePrefix(extensionId: string): string {
  return `/ext/${extensionId}`;
}

/**
 * Determines whether the given feature key belongs to the extension.
 */
export function isExtensionFeatureKey(
  extensionId: string,
  featureKey: string,
): boolean {
  return featureKey.startsWith(`ext${SEPARATOR}${extensionId}${SEPARATOR}`);
}

/**
 * Determines whether the given CASL subject belongs to the extension.
 */
export function isExtensionSubject(
  extensionId: string,
  subject: string,
): boolean {
  return subject.startsWith(`ext${SEPARATOR}${extensionId}${SEPARATOR}`);
}

/**
 * Sanitizes an extension id into a snake_case identifier.
 */
export function sanitizeExtensionId(extensionId: string): string {
  return extensionId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Stable, identifier-safe slug for an extension.
 *
 * Base is capped at 32 characters and the 8-character FNV-1a hash suffix keeps
 * generated table names deterministic and collision-resistant.
 */
export function extensionSlug(extensionId: string): string {
  const base = sanitizeExtensionId(extensionId).slice(0, SLUG_BASE_MAX_LENGTH);
  const safeBase = base || 'extension';
  const hash = fnv1a(extensionId).toString(16).padStart(8, '0');

  return `${safeBase}_${hash}`;
}

/**
 * Prefix for tenant tables owned by an extension.
 *
 * Example: `ext_acme_reports_1a2b3c4d_`
 */
export function extensionTablePrefix(extensionId: string): string {
  return `ext_${extensionSlug(extensionId)}_`;
}

/**
 * Knex migration table used to track an extension's migrations in a tenant DB.
 *
 * The result is at most 56 characters, safely below MySQL's 64-character
 * identifier limit.
 */
export function extensionMigrationTable(extensionId: string): string {
  return `ext_migrations_${extensionSlug(extensionId)}`;
}

/**
 * Query key prefix for the webapp's React Query cache.
 */
export function extensionQueryKeyPrefix(extensionId: string): string {
  return `ext${SEPARATOR}${extensionId}${SEPARATOR}`;
}

/**
 * FNV-1a 32-bit hash. Implemented locally so the shared SDK stays usable in
 * both Node and the browser without a crypto dependency.
 */
function fnv1a(value: string): number {
  let hash = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0;
}
