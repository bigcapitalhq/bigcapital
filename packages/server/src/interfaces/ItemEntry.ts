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
  discountType?: string;
  discount: number;
  quantity: number;
  rate: number;
  amount: number;

  total: number;
  totalExcludingTax?: number;

  subtotalInclusingTax: number;
  subtotalExcludingTax: number;
  discountAmount: number;

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

  taxRateId: number | null;
  taxRate: number;
  taxAmount: number;

  item?: IItem;

  allocatedCostEntries?: IBillLandedCostEntry[];
}

export interface IItemEntryDTO {
  id?: number;
  index?: number;
  itemId: number;
  landedCost?: boolean;
  warehouseId?: number;

  projectRefId?: number;
  projectRefType?: ProjectLinkRefType;
  projectRefInvoicedAmount?: number;

  taxRateId?: number;
  taxCode?: string;
}

export enum ProjectLinkRefType {
  Task = 'TASK',
  Bill = 'BILL',
  Expense = 'EXPENSE',
}
