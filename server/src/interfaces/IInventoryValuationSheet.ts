import {
  INumberFormatQuery,
  IFormatNumberSettings,
} from './FinancialStatements';

export interface IInventoryValuationReportQuery {
  asDate: Date | string;
  numberFormat: INumberFormatQuery;
  noneTransactions: boolean;  
};

export interface IInventoryValuationSheetMeta {
  organizationName: string,
  baseCurrency: string,
};

export interface IInventoryValuationItem {
  id: number,
  name: string,
  code: string,
  valuation: number,
  quantity: number,
  average: number,
  valuationFormatted: string,
  quantityFormatted: string,
  averageFormatted: string,
  currencyCode: string,
};

export interface IInventoryValuationTotal {
  valuation: number,
  quantity: number,
  
  valuationFormatted: string,
  quantityFormatted: string,
}

export interface IInventoryValuationStatement {
  items: IInventoryValuationItem[],
  total: IInventoryValuationTotal
};

