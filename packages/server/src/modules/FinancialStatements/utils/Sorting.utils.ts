/**
 * Financial report sorting utilities.
 *
 * Shared by the financial reports that support column sorting (trial balance,
 * balance sheet, ...). Each report maps its column keys to a value accessor and
 * delegates the comparison logic here.
 */

export type FinancialReportSortOrder = 'asc' | 'desc';

export type FinancialReportSortValue = string | number | null | undefined;

export type FinancialReportSortValueAccessor<T> = (
  node: T,
) => FinancialReportSortValue;

/**
 * Compares two report sort values.
 * Strings are compared locale-aware with numeric support, numbers are
 * compared by subtraction and empty values are treated as zero.
 * @param {FinancialReportSortValue} valueA
 * @param {FinancialReportSortValue} valueB
 * @returns {number}
 */
export const compareFinancialReportSortValues = (
  valueA: FinancialReportSortValue,
  valueB: FinancialReportSortValue,
): number => {
  if (typeof valueA === 'string' && typeof valueB === 'string') {
    return valueA.localeCompare(valueB, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  }
  return (Number(valueA) || 0) - (Number(valueB) || 0);
};

/**
 * Sorts the given report nodes by the accessor value and sort order.
 * Returns the original nodes when no accessor is provided.
 * @param {T[]} nodes
 * @param {FinancialReportSortValueAccessor<T>} accessor
 * @param {FinancialReportSortOrder} sortOrder
 * @returns {T[]}
 */
export const sortFinancialReportNodes = <T>(
  nodes: T[],
  accessor?: FinancialReportSortValueAccessor<T>,
  sortOrder: FinancialReportSortOrder = 'asc',
): T[] => {
  if (!accessor) {
    return nodes;
  }
  const direction = sortOrder === 'desc' ? -1 : 1;

  return [...nodes].sort((nodeA, nodeB) => {
    const comparison = compareFinancialReportSortValues(
      accessor(nodeA),
      accessor(nodeB),
    );
    return comparison !== 0 ? comparison * direction : 0;
  });
};
