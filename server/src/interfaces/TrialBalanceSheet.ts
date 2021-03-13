import { INumberFormatQuery } from './FinancialStatements';

export interface ITrialBalanceSheetQuery {
  fromDate: Date | string;
  toDate: Date | string;
  numberFormat: INumberFormatQuery;
  basis: 'cash' | 'accural';
  noneZero: boolean;
  noneTransactions: boolean;
  accountIds: number[];
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

export interface ITrialBalanceSheetMeta {
  isCostComputeRunning: boolean,
  organizationName: string,
  baseCurrency: string,
};

export interface ITrialBalanceAccount extends ITrialBalanceTotal {
  id: number;
  parentAccountId: number;
  name: string;
  code: string;
  accountNormal: string;
  hasTransactions: boolean;
}

export type ITrialBalanceSheetData = {
  accounts: ITrialBalanceAccount[];
  total: ITrialBalanceTotal;
};

export interface ITrialBalanceStatement {
  data: ITrialBalanceSheetData;
  query: ITrialBalanceSheetQuery;
  meta: ITrialBalanceSheetMeta,
}
