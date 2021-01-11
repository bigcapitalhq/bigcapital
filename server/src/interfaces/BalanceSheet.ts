
export interface IBalanceSheetQuery{
  displayColumnsType: 'total' | 'date_periods',
  displayColumnsBy: string,
  fromDate: Date|string,
  toDate: Date|string,
  numberFormat: {
    noCents: boolean,
    divideOn1000: boolean,
  },
  noneZero: boolean,
  noneTransactions: boolean,
  basis: 'cash' | 'accural',
  accountIds: number[],
}

export interface IBalanceSheetStatementService {
  balanceSheet(tenantId: number, query: IBalanceSheetQuery): Promise<IBalanceSheetStatement>;
}

export interface IBalanceSheetStatementColumns {

}

export interface IBalanceSheetStatementData {

}

export interface IBalanceSheetStatement {
  query: IBalanceSheetQuery,
  columns: IBalanceSheetStatementColumns,
  data: IBalanceSheetStatementData,
}

export interface IBalanceSheetStructureSection {
  name: string,
  sectionType?: string,
  type: 'section' | 'accounts_section',
  children?: IBalanceSheetStructureSection[],
  accountsTypesRelated?: string[],
  alwaysShow?: boolean,
}

export interface IBalanceSheetAccountTotal {
  amount: number,
  formattedAmount: string,
  currencyCode: string,
  date?: string|Date,
}

export interface IBalanceSheetAccount {
  id: number,
  index: number,
  name: string,
  code: string,
  parentAccountId: number,
  type: 'account',
  hasTransactions: boolean,
  children?: IBalanceSheetAccount[],
  total: IBalanceSheetAccountTotal,
  totalPeriods?: IBalanceSheetAccountTotal[],
}

export interface IBalanceSheetSection {
  name: string,
  sectionType?: string,
  type: 'section' | 'accounts_section',
  children: IBalanceSheetAccount[] | IBalanceSheetSection[],
  total: IBalanceSheetAccountTotal,
  totalPeriods?: IBalanceSheetAccountTotal[];

  accountsTypesRelated?: string[],
  _forceShow?: boolean,
}