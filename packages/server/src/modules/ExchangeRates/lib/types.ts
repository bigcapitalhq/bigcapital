export interface IExchangeRateService {
  latest(baseCurrency: string, toCurrency: string): Promise<number>;
}

export enum ExchangeRateServiceType {
  OpenExchangeRate = 'OpenExchangeRate',
  FXMacroData = 'FXMacroData',
}

export enum EchangeRateErrors {
  EX_RATE_SERVICE_NOT_ALLOWED = 'EX_RATE_SERVICE_NOT_ALLOWED',
  EX_RATE_LIMIT_EXCEEDED = 'EX_RATE_LIMIT_EXCEEDED',
  EX_RATE_SERVICE_API_KEY_REQUIRED = 'EX_RATE_SERVICE_API_KEY_REQUIRED',
  EX_RATE_INVALID_BASE_CURRENCY = 'EX_RATE_INVALID_BASE_CURRENCY',
}

export const OPEN_EXCHANGE_RATE_LATEST_URL =
  'https://openexchangerates.org/api/latest.json';

export const FXMACRODATA_FOREX_URL = 'https://api.fxmacrodata.com/v1/forex';
