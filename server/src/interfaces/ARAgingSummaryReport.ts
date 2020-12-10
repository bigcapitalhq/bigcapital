


export interface IARAgingSummaryQuery {
  asDate: Date | string,
  agingDaysBefore: number,
  agingPeriods: number,
  numberFormat: {
    noCents: number,
    divideOn1000: number,
  },
  customersIds: number[],
  noneZero: boolean,
}

export interface IAgingPeriod {
  fromPeriod: Date,
  toPeriod: Date,
  beforeDays: number,
  toDays: number,
};

export interface IAgingPeriodClosingBalance extends IAgingPeriod {
  closingBalance: number,
};

export interface IAgingPeriodTotal extends IAgingPeriod {
  total: number,
};

export interface ARAgingSummaryCustomerPeriod {

}

export interface ARAgingSummaryCustomerTotal {
  amount: number,
  formattedAmount: string,
  currencyCode: string,
}

export interface ARAgingSummaryCustomer {
  customerName: string,
  aging: IAgingPeriodTotal[],
  total: ARAgingSummaryCustomerTotal,
};
