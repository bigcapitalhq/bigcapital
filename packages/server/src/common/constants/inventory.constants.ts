/**
 * Supported inventory cost methods.
 */
export const COST_METHODS = ['AVG', 'FIFO', 'LIFO'] as const;

/**
 * Inventory cost method type.
 */
export type TCostMethod = (typeof COST_METHODS)[number];

/**
 * The default inventory cost method.
 */
export const DEFAULT_COST_METHOD: TCostMethod = 'AVG';

/**
 * Parses the given cost method value and returns null when the value is
 * missing or unknown. Useful for nullable/inherited cost method values.
 * @param {string|null|undefined} value - The cost method value.
 * @returns {TCostMethod|null}
 */
export function parseCostMethod(value?: string | null): TCostMethod | null {
  const normalizedValue = String(value ?? '')
    .trim()
    .toUpperCase();

  return (COST_METHODS as readonly string[]).includes(normalizedValue)
    ? (normalizedValue as TCostMethod)
    : null;
}

/**
 * Normalizes the given cost method value and falls back to the default
 * cost method when the value is missing or unknown.
 * @param {string|null|undefined} value - The cost method value.
 * @returns {TCostMethod}
 */
export function normalizeCostMethod(value?: string | null): TCostMethod {
  return parseCostMethod(value) ?? DEFAULT_COST_METHOD;
}

/**
 * Normalizes a nullable cost method value. Missing/empty values are preserved
 * as null so the caller can inherit the cost method from a higher level.
 * @param {string|null|undefined} value - The cost method value.
 * @returns {TCostMethod|null}
 */
export function normalizeNullableCostMethod(
  value?: string | null,
): TCostMethod | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return parseCostMethod(value);
}
