import {
  BALANCE_SHEET_SCHEMA_NODE_TYPE,
  IBalanceSheetDataNode,
} from './BalanceSheet.types';
import { BalanceSheetColumnKey } from '../../common/constants/tableColumnKeys';
import {
  FinancialReportSortOrder,
  FinancialReportSortValue,
  sortFinancialReportNodes,
} from '../../utils/Sorting.utils';

/**
 * Balance sheet data node with the optional children property of the union.
 */
type BalanceSheetSortNode = IBalanceSheetDataNode & {
  children?: IBalanceSheetDataNode[];
};

type BalanceSheetSortValueAccessor = (
  node: IBalanceSheetDataNode,
) => FinancialReportSortValue;

const sortValueAccessors: Record<
  BalanceSheetColumnKey,
  BalanceSheetSortValueAccessor
> = {
  name: (node) => node.name,
  total: (node) => node.total?.amount ?? 0,
  previous_period: (node) => node.previousPeriod?.amount ?? 0,
  previous_period_change: (node) => node.previousPeriodChange?.amount ?? 0,
  previous_period_percentage: (node) =>
    node.previousPeriodPercentage?.amount ?? 0,
  previous_year: (node) => node.previousYear?.amount ?? 0,
  previous_year_change: (node) => node.previousYearChange?.amount ?? 0,
  previous_year_percentage: (node) => node.previousYearPercentage?.amount ?? 0,
  percentage_of_column: (node) => node.percentageColumn?.amount ?? 0,
  percentage_of_row: (node) => node.percentageRow?.amount ?? 0,
};

/**
 * Determines whether the given report node is an account node.
 * @param {IBalanceSheetDataNode} node
 * @returns {boolean}
 */
const isAccountNode = (node: IBalanceSheetDataNode): boolean => {
  return node.nodeType === BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNT;
};

/**
 * Sorts the account nodes of the given report node children.
 * Aggregate, accounts and net income nodes define the report structure, so
 * they are never reordered; only the account nodes within each parent are
 * sorted while the structural nodes keep their relative order.
 * @param {IBalanceSheetDataNode} node
 * @param {BalanceSheetSortValueAccessor} accessor
 * @param {FinancialReportSortOrder} sortOrder
 * @returns {IBalanceSheetDataNode}
 */
const sortNodeChildren = (
  node: BalanceSheetSortNode,
  accessor: BalanceSheetSortValueAccessor,
  sortOrder: FinancialReportSortOrder,
): IBalanceSheetDataNode => {
  const children = node.children;

  if (!children?.length) {
    return node;
  }
  const accountNodes = children.filter(isAccountNode);
  const structuralNodes = children.filter((child) => !isAccountNode(child));

  const sortedAccountNodes = sortFinancialReportNodes(
    accountNodes,
    accessor,
    sortOrder,
  ).map((child) =>
    sortNodeChildren(child as BalanceSheetSortNode, accessor, sortOrder),
  );
  const sortedStructuralNodes = structuralNodes.map((child) =>
    sortNodeChildren(child as BalanceSheetSortNode, accessor, sortOrder),
  );

  return {
    ...node,
    children: [...sortedAccountNodes, ...sortedStructuralNodes],
  } as IBalanceSheetDataNode;
};

/**
 * Sorts the balance sheet report account nodes by the given column and order.
 * @param {IBalanceSheetDataNode[]} nodes
 * @param {BalanceSheetColumnKey} columnSortBy
 * @param {FinancialReportSortOrder} sortOrder
 * @returns {IBalanceSheetDataNode[]}
 */
export const sortBalanceSheetAccountsNodes = (
  nodes: IBalanceSheetDataNode[],
  columnSortBy?: BalanceSheetColumnKey,
  sortOrder: FinancialReportSortOrder = 'asc',
): IBalanceSheetDataNode[] => {
  const accessor = columnSortBy ? sortValueAccessors[columnSortBy] : undefined;

  if (!accessor) {
    return nodes;
  }
  return nodes.map((node) =>
    sortNodeChildren(node as BalanceSheetSortNode, accessor, sortOrder),
  );
};
