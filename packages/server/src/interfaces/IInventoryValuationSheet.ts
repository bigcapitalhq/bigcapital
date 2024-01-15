import { INumberFormatQuery } from './FinancialStatements';

export interface IInventoryValuationReportQuery {
  asDate: Date | string;
  numberFormat: INumberFormatQuery;
  noneTransactions: boolean;
  noneZero: boolean;
  onlyActive: boolean;
  itemsIds: number[];

  warehousesIds?: number[];
  branchesIds?: number[];
}

export interface IInventoryValuationSheetMeta {
  organizationName: string;
  baseCurrency: string;
  isCostComputeRunning: boolean;
}

export interface IInventoryValuationItem {
  id: number;
  name: string;
  code: string;
  valuation: number;
  quantity: number;
  average: number;
  valuationFormatted: string;
  quantityFormatted: string;
  averageFormatted: string;
  currencyCode: string;
}

export interface IInventoryValuationTotal {
  valuation: number;
  quantity: number;

  valuationFormatted: string;
  quantityFormatted: string;
}

export type IInventoryValuationStatement = {
  items: IInventoryValuationItem[];
  total: IInventoryValuationTotal;
};
export type IInventoryValuationSheetData = IInventoryValuationStatement;
