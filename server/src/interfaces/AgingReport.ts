export interface IAgingPeriodTotal {
  total: number;
  formattedTotal: string;
  currencyCode: string;
}

export interface IAgingPeriod {
  fromPeriod: Date|string;
  toPeriod: Date|string;
  beforeDays: number;
  toDays: number;
}