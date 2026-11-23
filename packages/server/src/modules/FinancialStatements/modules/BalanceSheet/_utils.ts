import {
  BALANCE_SHEET_SCHEMA_NODE_TYPE,
  IBalanceSheetDataNode,
} from './BalanceSheet.types';
import { BalanceSheetColumnKey } from '../../common/constants/tableColumnKeys';
import {
  FinancialReportSortOrder,
  FinancialReportSortValue,
  sortFinancialReportNodesTree,
} from '../../utils/Sorting.utils';

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
 * Sorts the balance sheet report account nodes by the given column and order.
 *
 * The aggregate, accounts and net income nodes define the report structure,
 * so they are never reordered; only the account nodes within each parent are
 * sorted.
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

  return sortFinancialReportNodesTree(
    nodes,
    isAccountNode,
    accessor,
    sortOrder,
  );
};
