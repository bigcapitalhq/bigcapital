import {
  IFinancialCommonHorizDatePeriodNode,
} from '../../types/Report.types';

export interface IBudgetVsActualTotal {
  amount: number;
  formattedAmount: string;
  currencyCode: string;
}

export interface IBudgetVsActualPercentage {
  amount: number;
  formattedAmount: string;
}

export interface IBudgetVsActualAccountNode {
  id: number;
  name: string;
  code?: string;
  nodeType: 'ACCOUNT';
  budget: IBudgetVsActualTotal;
  actual: IBudgetVsActualTotal;
  variance: IBudgetVsActualTotal;
  variancePercentage: IBudgetVsActualPercentage;
  horizontalBudgets?: IBudgetVsActualDatePeriodTotal[];
  horizontalActuals?: IBudgetVsActualDatePeriodTotal[];
  horizontalVariances?: IBudgetVsActualDatePeriodTotal[];
  horizontalVariancePercentages?: IBudgetVsActualDatePeriodPercentage[];
}

export interface IBudgetVsActualAggregateNode {
  id: string;
  name: string;
  nodeType: 'ACCOUNTS' | 'AGGREGATE';
  budget: IBudgetVsActualTotal;
  actual: IBudgetVsActualTotal;
  variance: IBudgetVsActualTotal;
  variancePercentage: IBudgetVsActualPercentage;
  children: IBudgetVsActualNode[];
  horizontalBudgets?: IBudgetVsActualDatePeriodTotal[];
  horizontalActuals?: IBudgetVsActualDatePeriodTotal[];
  horizontalVariances?: IBudgetVsActualDatePeriodTotal[];
  horizontalVariancePercentages?: IBudgetVsActualDatePeriodPercentage[];
}

export interface IBudgetVsActualEquationNode {
  id: string;
  name: string;
  nodeType: 'EQUATION';
  budget: IBudgetVsActualTotal;
  actual: IBudgetVsActualTotal;
  variance: IBudgetVsActualTotal;
  variancePercentage: IBudgetVsActualPercentage;
  horizontalBudgets?: IBudgetVsActualDatePeriodTotal[];
  horizontalActuals?: IBudgetVsActualDatePeriodTotal[];
  horizontalVariances?: IBudgetVsActualDatePeriodTotal[];
  horizontalVariancePercentages?: IBudgetVsActualDatePeriodPercentage[];
}

export interface IBudgetVsActualNetIncomeNode {
  id: string;
  name: string;
  nodeType: 'NET_INCOME';
  budget: IBudgetVsActualTotal;
  actual: IBudgetVsActualTotal;
  variance: IBudgetVsActualTotal;
  variancePercentage: IBudgetVsActualPercentage;
  horizontalBudgets?: IBudgetVsActualDatePeriodTotal[];
  horizontalActuals?: IBudgetVsActualDatePeriodTotal[];
  horizontalVariances?: IBudgetVsActualDatePeriodTotal[];
  horizontalVariancePercentages?: IBudgetVsActualDatePeriodPercentage[];
}

export type IBudgetVsActualNode =
  | IBudgetVsActualAccountNode
  | IBudgetVsActualAggregateNode
  | IBudgetVsActualEquationNode
  | IBudgetVsActualNetIncomeNode;

export interface IBudgetVsActualDatePeriodTotal
  extends IFinancialCommonHorizDatePeriodNode {
  budget: IBudgetVsActualTotal;
  actual: IBudgetVsActualTotal;
  variance: IBudgetVsActualTotal;
  variancePercentage: IBudgetVsActualPercentage;
}

export interface IBudgetVsActualDatePeriodPercentage {
  fromDate: { date: Date; formattedDate: string };
  toDate: { date: Date; formattedDate: string };
  amount: number;
  formattedAmount: string;
}

export interface IBudgetVsActualQuery {
  budgetId: number;
  fromDate?: Date | string;
  toDate?: Date | string;
  displayColumnsType?: string;
  displayColumnsBy?: string;
  numberFormat?: any;
  noneZero?: boolean;
  noneTransactions?: boolean;
  accountsIds?: number[];
  branchesIds?: number[];
}

export interface IBudgetVsActualMeta {
  organizationName: string;
  baseCurrency: string;
  dateFormat: string;
  sheetName: string;
  budgetName: string;
  budgetType: string;
  periodType: string;
  fromDate: { date: Date; formattedDate: string };
  toDate: { date: Date; formattedDate: string };
  isCostComputeRunning: boolean;
}

export interface IBudgetVsActualSheetData {
  data: IBudgetVsActualNode[];
  query: IBudgetVsActualQuery;
  meta: IBudgetVsActualMeta;
}
