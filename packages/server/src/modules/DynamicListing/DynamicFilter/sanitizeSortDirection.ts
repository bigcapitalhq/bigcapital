/**
 * Normalises an arbitrary `sortOrder` value to a SQL-safe direction.
 * Returns 'DESC' only on an explicit case-insensitive match; otherwise 'ASC'.
 * Used to defuse `orderByRaw` interpolation in dynamic listing modifiers.
 */
export function sanitizeSortDirection(order: unknown): 'ASC' | 'DESC' {
  return String(order ?? '').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
}
