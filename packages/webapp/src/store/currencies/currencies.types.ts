export interface CurrenciesState {
  data: Record<string, unknown>;
  loading: boolean;
}

export type CurrencyAction = {
  type: string;
  currencies?: Array<Record<string, unknown>>;
  loading?: boolean;
  currency_code?: string;
};

export const CURRENCIES_REGISTERED_SET = 'CURRENCIES_REGISTERED_SET' as const;
export const CLEAR_CURRENCY_FORM_ERRORS = 'CLEAR_CURRENCY_FORM_ERRORS' as const;
export const CURRENCIES_TABLE_LOADING = 'CURRENCIES_TABLE_LOADING' as const;
export const CURRENCY_CODE_DELETE = 'CURRENCY_CODE_DELETE' as const;
