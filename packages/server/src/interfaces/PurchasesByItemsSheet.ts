import {
  IFinancialSheetCommonMeta,
  INumberFormatQuery,
} from './FinancialStatements';
import { IFinancialTable } from './Table';

export interface IPurchasesByItemsReportQuery {
  fromDate: Date | string;
  toDate: Date | string;
  itemsIds: number[];
  numberFormat: INumberFormatQuery;
  noneTransactions: boolean;
  onlyActive: boolean;
}

export interface IPurchasesByItemsSheetMeta extends IFinancialSheetCommonMeta {
  formattedFromDate: string;
  formattedToDate: string;
  formattedDateRange: string;
}

export interface IPurchasesByItemsItem {
  id: number;
  name: string;
  code: string;
  quantitySold: number;
  soldCost: number;
  averageSellPrice: number;

  quantitySoldFormatted: string;
  soldCostFormatted: string;
  averageSellPriceFormatted: string;
  currencyCode: string;
}

export interface IPurchasesByItemsTotal {
  quantitySold: number;
  soldCost: number;
  quantitySoldFormatted: string;
  soldCostFormatted: string;
  currencyCode: string;
}

export type IPurchasesByItemsSheetData = {
  items: IPurchasesByItemsItem[];
  total: IPurchasesByItemsTotal;
};

export interface IPurchasesByItemsSheet {
  data: IPurchasesByItemsSheetData;
  query: IPurchasesByItemsReportQuery;
  meta: IPurchasesByItemsSheetMeta;
}

export interface IPurchasesByItemsTable extends IFinancialTable {
  query: IPurchasesByItemsReportQuery;
  meta: IPurchasesByItemsSheetMeta;
}
