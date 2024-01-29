export interface ExchangeRateLatestDTO {
  toCurrency: string;
  fromCurrency: string;
}

export interface EchangeRateLatestPOJO {
  baseCurrency: string;
  toCurrency: string;
  exchangeRate: number;
}
