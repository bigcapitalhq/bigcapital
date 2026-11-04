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
 * Normalizes the given cost method value and falls back to the default
 * cost method when the value is missing or unknown.
 * @param {string|null|undefined} value - The cost method value.
 * @returns {TCostMethod}
 */
export function normalizeCostMethod(value?: string | null): TCostMethod {
  const normalizedValue = String(value ?? '')
    .trim()
    .toUpperCase();

  return (COST_METHODS as readonly string[]).includes(normalizedValue)
    ? (normalizedValue as TCostMethod)
    : DEFAULT_COST_METHOD;
}
