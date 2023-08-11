import { IItem } from './Item';
import { IBillLandedCostEntry } from './LandedCost';

export type IItemEntryTransactionType = 'SaleInvoice' | 'Bill' | 'SaleReceipt';

export interface IItemEntry {
  id?: number;

  referenceType: string;
  referenceId: number;

  index: number;

  itemId: number;
  description: string;
  discount: number;
  quantity: number;
  rate: number;
  amount: number;

  landedCost: number;
  allocatedCostAmount: number;
  unallocatedCostAmount: number;

  sellAccountId: number;
  costAccountId: number;

  warehouseId: number;
  projectId: number;

  projectRefId?: number;
  projectRefType?: ProjectLinkRefType;
  projectRefInvoicedAmount?: number;

  taxCode: string;
  taxRate: number;

  item?: IItem;

  allocatedCostEntries?: IBillLandedCostEntry[];
}

export interface IItemEntryDTO {
  id?: number;
  itemId: number;
  landedCost?: boolean;
  warehouseId?: number;

  projectRefId?: number;
  projectRefType?: ProjectLinkRefType;
  projectRefInvoicedAmount?: number;

  taxCode: string;
  taxRate: number;
}

export enum ProjectLinkRefType {
  Task = 'TASK',
  Bill = 'BILL',
  Expense = 'EXPENSE',
}
