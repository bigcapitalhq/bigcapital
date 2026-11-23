import {
  IProfitLossSheetNode,
  ProfitLossNodeType,
} from './ProfitLossSheet.types';
import { ProfitLossColumnKey } from '../../common/constants/tableColumnKeys';
import {
  FinancialReportSortOrder,
  FinancialReportSortValue,
  sortFinancialReportNodesTree,
} from '../../utils/Sorting.utils';

type ProfitLossSortValueAccessor = (
  node: IProfitLossSheetNode,
) => FinancialReportSortValue;

const sortValueAccessors: Record<
  ProfitLossColumnKey,
  ProfitLossSortValueAccessor
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
  percentage_income: (node) => node.percentageIncome?.amount ?? 0,
  // The column key is plural while the node property is singular.
  percentage_expenses: (node) => node.percentageExpense?.amount ?? 0,
  percentage_column: (node) => node.percentageColumn?.amount ?? 0,
  percentage_row: (node) => node.percentageRow?.amount ?? 0,
};

/**
 * Determines whether the given report node is an account node.
 * @param {IProfitLossSheetNode} node
 * @returns {boolean}
 */
const isAccountNode = (node: IProfitLossSheetNode): boolean => {
  return node.nodeType === ProfitLossNodeType.ACCOUNT;
};

/**
 * Sorts the profit/loss sheet report account nodes by the given column and
 * order.
 *
 * The accounts and equations nodes define the report structure, so they are
 * never reordered; only the account nodes within each parent are sorted.
 * @param {IProfitLossSheetNode[]} nodes
 * @param {ProfitLossColumnKey} columnSortBy
 * @param {FinancialReportSortOrder} sortOrder
 * @returns {IProfitLossSheetNode[]}
 */
export const sortProfitLossSheetAccountsNodes = (
  nodes: IProfitLossSheetNode[],
  columnSortBy?: ProfitLossColumnKey,
  sortOrder: FinancialReportSortOrder = 'asc',
): IProfitLossSheetNode[] => {
  const accessor = columnSortBy ? sortValueAccessors[columnSortBy] : undefined;

  return sortFinancialReportNodesTree(
    nodes,
    isAccountNode,
    accessor,
    sortOrder,
  );
};
