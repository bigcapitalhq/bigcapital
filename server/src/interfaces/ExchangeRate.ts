
export interface IExchangeRate {
  id: number,
  currencyCode: string,
  exchangeRate: number,
  date: Date,
  createdAt: Date,
  updatedAt: Date,
};

export interface IExchangeRateDTO {
  currencyCode: string,
  exchangeRate: number,
  date: Date,
};

export interface IExchangeRateEditDTO {
  exchangeRate: number,
};

export interface IExchangeRateFilter {
  page: number,
  pageSize: number,
};

export interface IExchangeRatesService {
  newExchangeRate(tenantId: number, exchangeRateDTO: IExchangeRateDTO): Promise<IExchangeRate>;
  editExchangeRate(tenantId: number, exchangeRateId: number, editExRateDTO: IExchangeRateEditDTO): Promise<void>;

  deleteExchangeRate(tenantId: number, exchangeRateId: number): Promise<void>;
  listExchangeRates(tenantId: number, exchangeRateFilter: IExchangeRateFilter): Promise<void>;
};