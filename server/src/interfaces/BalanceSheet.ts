import {
  INumberFormatQuery,
  IFormatNumberSettings,
} from './FinancialStatements';

export interface IBalanceSheetQuery {
  displayColumnsType: 'total' | 'date_periods';
  displayColumnsBy: string;
  fromDate: Date | string;
  toDate: Date | string;
  numberFormat: INumberFormatQuery;
  noneTransactions: boolean;
  noneZero: boolean;
  basis: 'cash' | 'accural';
  accountIds: number[];
}

export interface IBalanceSheetMeta {
  isCostComputeRunning: boolean,
  organizationName: string,
  baseCurrency: string,
};

export interface IBalanceSheetFormatNumberSettings
  extends IFormatNumberSettings {
  type: string;
};

export interface IBalanceSheetStatementService {
  balanceSheet(
    tenantId: number,
    query: IBalanceSheetQuery
  ): Promise<IBalanceSheetStatement>;
}

export interface IBalanceSheetStatementColumns {}

export interface IBalanceSheetStatementData {}

export interface IBalanceSheetStatement {
  query: IBalanceSheetQuery;
  columns: IBalanceSheetStatementColumns;
  data: IBalanceSheetStatementData;
  meta: IBalanceSheetMeta;
}

export interface IBalanceSheetStructureSection {
  name: string;
  sectionType?: string;
  type: 'section' | 'accounts_section';
  children?: IBalanceSheetStructureSection[];
  accountsTypes?: string[];
  alwaysShow?: boolean;
}

export interface IBalanceSheetAccountTotal {
  amount: number;
  formattedAmount: string;
  currencyCode: string;
  date?: string | Date;
}

export interface IBalanceSheetAccount {
  id: number;
  index: number;
  name: string;
  code: string;
  parentAccountId: number;
  type: 'account';
  hasTransactions: boolean;
  children?: IBalanceSheetAccount[];
  total: IBalanceSheetAccountTotal;
  totalPeriods?: IBalanceSheetAccountTotal[];
}

export interface IBalanceSheetSection {
  name: string;
  sectionType?: string;
  type: 'section' | 'accounts_section';
  children: IBalanceSheetAccount[] | IBalanceSheetSection[];
  total: IBalanceSheetAccountTotal;
  totalPeriods?: IBalanceSheetAccountTotal[];

  accountsTypes?: string[];
  _forceShow?: boolean;
}
