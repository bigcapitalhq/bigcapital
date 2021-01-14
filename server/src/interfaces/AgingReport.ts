export interface IAgingPeriodTotal extends IAgingPeriod {
  total: IAgingAmount;
};

export interface IAgingAmount {
  amount: number;
  formattedAmount: string;
  currencyCode: string;
}

export interface IAgingPeriod {
  fromPeriod: Date | string;
  toPeriod: Date | string;
  beforeDays: number;
  toDays: number;
}

export interface IAgingSummaryContact {
  current: IAgingAmount;
  aging: IAgingPeriodTotal[];
  total: IAgingAmount;
}
