import {
  IFinancialSheetCommonMeta,
  INumberFormatQuery,
} from './FinancialStatements';
import { IFinancialTable } from './Table';

export interface ITrialBalanceSheetQuery {
  fromDate: Date | string;
  toDate: Date | string;
  numberFormat: INumberFormatQuery;
  basis: 'cash' | 'accrual';
  noneZero: boolean;
  noneTransactions: boolean;
  onlyActive: boolean;
  accountIds: number[];
  branchesIds?: number[];
}

export interface ITrialBalanceTotal {
  credit: number;
  debit: number;
  balance: number;
  currencyCode: string;

  formattedCredit: string;
  formattedDebit: string;
  formattedBalance: string;
}

export interface ITrialBalanceSheetMeta extends IFinancialSheetCommonMeta {
  formattedFromDate: string;
  formattedToDate: string;
  formattedDateRange: string;
}

export interface ITrialBalanceAccount extends ITrialBalanceTotal {
  id: number;
  parentAccountId: number;
  name: string;
  formattedName: string;
  code: string;
  accountNormal: string;
}

export type ITrialBalanceSheetData = {
  accounts: ITrialBalanceAccount[];
  total: ITrialBalanceTotal;
};

export interface ITrialBalanceStatement {
  data: ITrialBalanceSheetData;
  query: ITrialBalanceSheetQuery;
  meta: ITrialBalanceSheetMeta;
}

export interface ITrialBalanceSheetTable extends IFinancialTable {
  meta: ITrialBalanceSheetMeta;
  query: ITrialBalanceSheetQuery;
}
