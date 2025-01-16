import {
  IFinancialSheetCommonMeta,
  INumberFormatQuery,
} from '@/modules/FinancialStatements/types/Report.types';
import { IFinancialTable } from '@/modules/FinancialStatements/types/Table.types';

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
  soldCost: number;

  averageSellPrice: number;
  averageSellPriceFormatted: string;
  
  quantityPurchased: number;
  quantityPurchasedFormatted: string;

  soldCostFormatted: string;
  currencyCode: string;
}

export interface IPurchasesByItemsTotal {
  quantityPurchased: number;
  quantityPurchasedFormatted: string;
  purchaseCost: number;
  purchaseCostFormatted: string;
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
