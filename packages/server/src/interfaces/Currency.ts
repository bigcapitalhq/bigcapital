

export interface ICurrencyDTO {
  currencyName: string,
  currencyCode: string,
  currencySign: string,
};
export interface ICurrencyEditDTO {
  currencyName: string,
  currencySign: string,
}
export interface ICurrency {
  id: number,
  currencyName: string,
  currencyCode: string,
  currencySign: string,
  createdAt: Date,
  updatedAt: Date,
};

export interface ICurrenciesService {
  newCurrency(tenantId: number, currencyDTO: ICurrencyDTO): Promise<void>;
  editCurrency(tenantId: number, currencyId: number, editCurrencyDTO: ICurrencyEditDTO): Promise<void>;

  deleteCurrency(tenantId: number, currencyCode: string): Promise<void>;
  listCurrencies(tenantId: number): Promise<ICurrency[]>;
}