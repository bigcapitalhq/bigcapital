import {
  IFinancialSheetCommonMeta,
  INumberFormatQuery,
} from '../../types/Report.types';
import { IFinancialTable } from '../../types/Table.types';
import { TInventoryTransactionDirection } from '@/modules/InventoryCost/types/InventoryCost.types';

export interface IInventoryTurnoverByAmountQuery {
  fromDate: Date | string;
  toDate: Date | string;
  numberFormat: INumberFormatQuery;
  itemsIds: number[];

  warehousesIds?: number[];
  branchesIds?: number[];
}

export interface IInventoryTurnoverCostLots {
  costIn: number;
  costOut: number;
}

export interface IInventoryTurnoverCostLotAggregate {
  itemId: number;
  direction: TInventoryTransactionDirection;
  cost: number;
}

export interface IInventoryTurnoverQuantityAggregate {
  itemId: number;
  direction: TInventoryTransactionDirection;
  quantity: number;
}

export interface IInventoryTurnoverLastSellDateAggregate {
  itemId: number;
  lastSellDate: Date | string;
}

export interface IInventoryTurnoverByAmountMeta
  extends IFinancialSheetCommonMeta {
  formattedFromDate: string;
  formattedToDate: string;
  formattedDateRange: string;
}

export interface IInventoryTurnoverByAmountItem {
  id: number;
  name: string;
  code: string;

  openingBalance: number;
  closingBalance: number;
  costOfGoodsSold: number;
  averagePrice: number;
  turnoverRatio: number;
  averageTurnoverDays: number;
  qtyOnHand: number;
  lastSellDate: Date | string | null;

  openingBalanceFormatted: string;
  closingBalanceFormatted: string;
  costOfGoodsSoldFormatted: string;
  averagePriceFormatted: string;
  turnoverRatioFormatted: string;
  averageTurnoverDaysFormatted: string;
  qtyOnHandFormatted: string;
  lastSellDateFormatted: string;

  currencyCode: string;
}

export interface IInventoryTurnoverByAmountTotal {
  openingBalance: number;
  closingBalance: number;
  costOfGoodsSold: number;
  averagePrice: number;
  turnoverRatio: number;
  averageTurnoverDays: number;
  qtyOnHand: number;
  lastSellDate: null;

  openingBalanceFormatted: string;
  closingBalanceFormatted: string;
  costOfGoodsSoldFormatted: string;
  averagePriceFormatted: string;
  turnoverRatioFormatted: string;
  averageTurnoverDaysFormatted: string;
  qtyOnHandFormatted: string;
  lastSellDateFormatted: string;

  currencyCode: string;
}

export type IInventoryTurnoverByAmountData = {
  items: IInventoryTurnoverByAmountItem[];
  total: IInventoryTurnoverByAmountTotal;
};

export interface IInventoryTurnoverByAmountSheet {
  data: IInventoryTurnoverByAmountData;
  query: IInventoryTurnoverByAmountQuery;
  meta: IInventoryTurnoverByAmountMeta;
}

export interface IInventoryTurnoverByAmountTable extends IFinancialTable {
  query: IInventoryTurnoverByAmountQuery;
  meta: IInventoryTurnoverByAmountMeta;
}
