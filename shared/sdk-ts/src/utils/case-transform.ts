/**
 * Utilities for transforming object keys from snake_case to camelCase.
 * Used to transform API response keys to match TypeScript camelCase types.
 */

/**
 * Converts a snake_case string to camelCase.
 */
export function snakeToCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Cache for tracking visited objects during deep transformation.
 * Prevents infinite loops with circular references.
 */
type TransformCache = WeakMap<object, any>;

/**
 * Deeply transforms all keys in an object from snake_case to camelCase.
 * Handles nested objects, arrays, null, undefined, and primitive values.
 * Uses WeakMap caching to handle circular references safely.
 */
export function transformKeysToCamelCase<T>(value: unknown, cache?: TransformCache): T {
  // Handle null and undefined
  if (value === null || value === undefined) {
    return value as T;
  }

  // Handle primitives (string, number, boolean, symbol, bigint)
  if (typeof value !== 'object') {
    return value as T;
  }

  // Handle Date objects - no keys to transform
  if (value instanceof Date) {
    return value as T;
  }

  // Handle Blob objects - no keys to transform
  if (value instanceof Blob) {
    return value as T;
  }

  // Initialize cache if not provided
  const localCache = cache ?? new WeakMap();

  // Check cache for circular references
  if (localCache.has(value as object)) {
    return localCache.get(value as object);
  }

  // Handle arrays
  if (Array.isArray(value)) {
    const result: unknown[] = [];
    localCache.set(value, result);
    for (const item of value) {
      result.push(transformKeysToCamelCase(item, localCache));
    }
    return result as T;
  }

  // Handle plain objects
  const result: Record<string, unknown> = {};
  localCache.set(value as object, result);

  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      const camelKey = snakeToCamelCase(key);
      const itemValue = (value as Record<string, unknown>)[key];
      result[camelKey] = transformKeysToCamelCase(itemValue, localCache);
    }
  }

  return result as T;
}

/**
 * Converts a camelCase string to snake_case.
 */
export function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Deeply transforms all keys in an object from camelCase to snake_case.
 * Handles nested objects, arrays, null, undefined, and primitive values.
 * Uses WeakMap caching to handle circular references safely.
 */
export function transformKeysToSnakeCase<T>(value: unknown, cache?: TransformCache): T {
  if (value === null || value === undefined) {
    return value as T;
  }

  if (typeof value !== 'object') {
    return value as T;
  }

  if (value instanceof Date) {
    return value as T;
  }

  if (value instanceof Blob) {
    return value as T;
  }

  const localCache = cache ?? new WeakMap();

  if (localCache.has(value as object)) {
    return localCache.get(value as object);
  }

  if (Array.isArray(value)) {
    const result: unknown[] = [];
    localCache.set(value, result);
    for (const item of value) {
      result.push(transformKeysToSnakeCase(item, localCache));
    }
    return result as T;
  }

  const result: Record<string, unknown> = {};
  localCache.set(value as object, result);

  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      const snakeKey = camelToSnakeCase(key);
      const itemValue = (value as Record<string, unknown>)[key];
      result[snakeKey] = transformKeysToSnakeCase(itemValue, localCache);
    }
  }

  return result as T;
}
