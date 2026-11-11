import intl from 'react-intl-universal';

/**
 * Supported inventory cost methods.
 * Keep in sync with the server `COST_METHODS` constant.
 */
export const ITEM_COST_METHODS = ['AVG', 'FIFO', 'LIFO'] as const;

export type ItemCostMethod = (typeof ITEM_COST_METHODS)[number];

/**
 * Empty value means inherit the cost method from the higher level
 * (item category or the items preference).
 */
export const ITEM_COST_METHOD_INHERIT = '';

export type ItemCostMethodValue =
  | ItemCostMethod
  | typeof ITEM_COST_METHOD_INHERIT;

/**
 * Normalizes a cost method value. Missing/unknown values are treated as
 * "inherit" so the caller can resolve the effective method.
 */
export function normalizeItemCostMethod(
  value?: string | null,
): ItemCostMethodValue {
  const normalizedValue = String(value ?? '')
    .trim()
    .toUpperCase();

  return (ITEM_COST_METHODS as readonly string[]).includes(normalizedValue)
    ? (normalizedValue as ItemCostMethod)
    : ITEM_COST_METHOD_INHERIT;
}

/**
 * Retrieves the translated label of the given cost method.
 */
export function getItemCostMethodLabel(value?: string | null): string {
  const costMethod = normalizeItemCostMethod(value) || 'AVG';

  return costMethod === 'AVG'
    ? intl.get('cost_method_average')
    : intl.get(`cost_method_${costMethod.toLowerCase()}`);
}
