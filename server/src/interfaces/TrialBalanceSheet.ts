
export interface ITrialBalanceSheetQuery {
  fromDate: Date|string,
  toDate: Date|string,
  numberFormat: {
    noCents: boolean,
    divideOn1000: boolean,
  },
  basis: 'cash' | 'accural',
  noneZero: boolean,
  noneTransactions: boolean,
  accountIds: number[],
}

export interface ITrialBalanceAccount {
  id: number,
  parentAccountId: number,
  name: string,
  code: string,
  accountNormal: string,
  hasTransactions: boolean,

  credit: number,
  debit: number,
  balance: number,

  formattedCredit: string,
  formattedDebit: string,
  formattedBalance: string,
}

export type ITrialBalanceSheetData = IBalanceSheetSection[];

export interface ITrialBalanceStatement {
  data: ITrialBalanceSheetData,
  query: ITrialBalanceSheetQuery,
}