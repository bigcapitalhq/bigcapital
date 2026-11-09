/**
 * Financial report sorting utilities.
 *
 * Shared by the financial reports that support column sorting (trial balance,
 * balance sheet, profit & loss, ...). Each report maps its column keys to a
 * value accessor and delegates the comparison logic here.
 */

export type FinancialReportSortOrder = 'asc' | 'desc';

export type FinancialReportSortValue = string | number | null | undefined;

export type FinancialReportSortValueAccessor<T> = (
  node: T,
) => FinancialReportSortValue;

/**
 * Report node that may have nested children.
 */
export type FinancialReportTreeNode<T> = T & { children?: T[] };

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

/**
 * Sorts the sortable nodes children of the given report node.
 *
 * The sortable nodes are sorted in place among their siblings, which keeps the
 * structural nodes (aggregates, equations, ...) positions untouched, and the
 * sorting is applied recursively to the children of every node.
 * @param {T} node
 * @param {(node: T) => boolean} isSortableNode
 * @param {FinancialReportSortValueAccessor<T>} accessor
 * @param {FinancialReportSortOrder} sortOrder
 * @returns {T}
 */
const sortFinancialReportNodeChildren = <T>(
  node: T,
  isSortableNode: (node: T) => boolean,
  accessor: FinancialReportSortValueAccessor<T>,
  sortOrder: FinancialReportSortOrder,
): T => {
  const children = (node as FinancialReportTreeNode<T>).children;

  if (!children?.length) {
    return node;
  }
  const sortedSortableChildren = sortFinancialReportNodes(
    children.filter(isSortableNode),
    accessor,
    sortOrder,
  );
  let sortedIndex = 0;

  const nextChildren = children.map((child) => {
    const nextChild = isSortableNode(child)
      ? sortedSortableChildren[sortedIndex++]
      : child;

    return sortFinancialReportNodeChildren(
      nextChild,
      isSortableNode,
      accessor,
      sortOrder,
    );
  });

  return {
    ...node,
    children: nextChildren,
  };
};

/**
 * Sorts the given report nodes tree by the accessor value and sort order.
 *
 * Only the nodes matching the given predicate are sorted (e.g. account nodes)
 * while the other nodes keep their positions, the sorting is applied
 * recursively to the children of every node and the original nodes are
 * returned when no accessor is provided.
 * @param {T[]} nodes
 * @param {(node: T) => boolean} isSortableNode
 * @param {FinancialReportSortValueAccessor<T>} accessor
 * @param {FinancialReportSortOrder} sortOrder
 * @returns {T[]}
 */
export const sortFinancialReportNodesTree = <T>(
  nodes: T[],
  isSortableNode: (node: T) => boolean,
  accessor?: FinancialReportSortValueAccessor<T>,
  sortOrder: FinancialReportSortOrder = 'asc',
): T[] => {
  if (!accessor) {
    return nodes;
  }
  return nodes.map((node) =>
    sortFinancialReportNodeChildren(node, isSortableNode, accessor, sortOrder),
  );
};
