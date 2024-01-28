export interface ExchangeRateLatestDTO {
  toCurrency: string;
}

export interface EchangeRateLatestPOJO {
  baseCurrency: string;
  toCurrency: string;
  exchangeRate: number;
}
