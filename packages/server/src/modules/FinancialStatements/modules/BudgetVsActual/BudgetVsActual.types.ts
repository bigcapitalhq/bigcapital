import {
  IFinancialSheetCommonMeta,
  INumberFormatQuery,
} from '../../types/Report.types';
import { IFinancialTable } from '../../types/Table.types';

export type BudgetVsActualDisplayColumnsBy = 'month' | 'quarter' | 'year';

export interface IBudgetVsActualQuery {
  budgetId: number;
  fromDate: Date | string;
  toDate: Date | string;
  displayColumnsBy: BudgetVsActualDisplayColumnsBy;
  numberFormat: INumberFormatQuery;
  branchesIds?: number[];
  accountsIds?: number[];
}

export interface IBudgetVsActualPeriod {
  key: string;
  label: string;
  fromDate: Date | string;
  toDate: Date | string;
}

export interface IBudgetVsActualCell {
  budget: number;
  formattedBudget: string;

  actual: number;
  formattedActual: string;

  variance: number;
  formattedVariance: string;

  percentage: number;
  formattedPercentage: string;
}

export interface IBudgetVsActualAccountRow {
  accountId: number;
  accountCode: string;
  accountName: string;
  accountType: string;
  cells: IBudgetVsActualCell[];
  total: IBudgetVsActualCell;
}

export interface IBudgetVsActualReportData {
  periods: IBudgetVsActualPeriod[];
  accounts: IBudgetVsActualAccountRow[];
  totals: {
    periods: IBudgetVsActualCell[];
    total: IBudgetVsActualCell;
  };
}

export interface IBudgetVsActualMeta extends IFinancialSheetCommonMeta {
  budgetId: number;
  budgetName: string;
  formattedFromDate: string;
  formattedToDate: string;
  formattedDateRange: string;
}

export interface IBudgetVsActualTable extends IFinancialTable {
  query: IBudgetVsActualQuery;
  meta: IBudgetVsActualMeta;
}

export interface IBudgetVsActualResponse {
  data: IBudgetVsActualReportData;
  query: IBudgetVsActualQuery;
  meta: IBudgetVsActualMeta;
}
