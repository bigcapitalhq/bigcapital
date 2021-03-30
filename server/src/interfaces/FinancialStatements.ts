export interface INumberFormatQuery {
  precision: number;
  divideOn1000: boolean;
  showZero: boolean;
  formatMoney: 'total' | 'always' | 'none';
  negativeFormat: 'parentheses' | 'mines';
}

export interface IFormatNumberSettings {
  precision?: number;
  divideOn1000?: boolean;
  excerptZero?: boolean;
  negativeFormat?: 'parentheses' | 'mines';
  thousand?: string;
  decimal?: string;
  zeroSign?: string;
  currencyCode?: string;
  money?: boolean,
}
