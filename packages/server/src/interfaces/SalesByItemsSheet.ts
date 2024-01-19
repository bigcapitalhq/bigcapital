import { INumberFormatQuery } from './FinancialStatements';
import { IFinancialTable } from './Table';

export interface ISalesByItemsReportQuery {
  fromDate: Date | string;
  toDate: Date | string;
  itemsIds: number[];
  numberFormat: INumberFormatQuery;
  noneTransactions: boolean;
  onlyActive: boolean;
}

export interface ISalesByItemsSheetMeta {
  organizationName: string;
  baseCurrency: string;
}

export interface ISalesByItemsItem {
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

export interface ISalesByItemsTotal {
  quantitySold: number;
  soldCost: number;
  quantitySoldFormatted: string;
  soldCostFormatted: string;
  currencyCode: string;
}

export type ISalesByItemsSheetData = {
  items: ISalesByItemsItem[];
  total: ISalesByItemsTotal;
};

export interface ISalesByItemsSheet {
  data: ISalesByItemsSheetData;
  query: ISalesByItemsReportQuery;
  meta: ISalesByItemsSheetMeta;
}

export interface ISalesByItemsTable extends IFinancialTable {
  query: ISalesByItemsReportQuery;
  meta: ISalesByItemsSheetMeta;
}