import {
  IFinancialSheetCommonMeta,
  INumberFormatQuery,
} from '../../types/Report.types';
import { IFinancialTable } from '../../types/Table.types';

export interface IInventorySummaryQuery {
  fromDate: Date | string;
  toDate: Date | string;
  numberFormat: INumberFormatQuery;
  noneTransactions: boolean;
  itemsIds: number[];

  warehousesIds?: number[];
  branchesIds?: number[];
}

export interface IInventorySummaryItem {
  id: number;
  name: string;
  code: string;

  openingStock: number;
  quantityIn: number;
  quantityOut: number;
  closingStock: number;

  openingStockFormatted: string;
  quantityInFormatted: string;
  quantityOutFormatted: string;
  closingStockFormatted: string;
}

export interface IInventorySummaryTotal {
  openingStock: number;
  quantityIn: number;
  quantityOut: number;
  closingStock: number;

  openingStockFormatted: string;
  quantityInFormatted: string;
  quantityOutFormatted: string;
  closingStockFormatted: string;
}

export type IInventorySummaryData = {
  items: IInventorySummaryItem[];
  total: IInventorySummaryTotal;
};

export interface IInventorySummaryMeta extends IFinancialSheetCommonMeta {
  formattedFromDate: string;
  formattedToDate: string;
  formattedDateRange: string;
}

export interface IInventorySummarySheet {
  data: IInventorySummaryData;
  query: IInventorySummaryQuery;
  meta: IInventorySummaryMeta;
}

export interface IInventorySummaryTable extends IFinancialTable {
  query: IInventorySummaryQuery;
  meta: IInventorySummaryMeta;
}
