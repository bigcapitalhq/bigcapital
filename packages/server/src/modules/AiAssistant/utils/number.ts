/**
 * MySQL returns DECIMAL aggregates as strings. Normalizes a value to a number
 * so tool outputs are stable and the model does not receive numeric strings.
 */
export const toNumber = (value: unknown): number => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

/**
 * Rounds a numeric value to the given number of decimals.
 */
export const round = (value: unknown, precision: number = 2): number => {
  const number = toNumber(value);
  const factor = 10 ** precision;
  return Math.round((number + Number.EPSILON) * factor) / factor;
};

/**
 * Returns a percentage, guarding against division by zero.
 */
export const percentage = (part: unknown, total: unknown): number => {
  const totalNumber = toNumber(total);
  if (totalNumber === 0) {
    return 0;
  }
  return round((toNumber(part) / totalNumber) * 100, 2);
};
