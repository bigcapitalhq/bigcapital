export type IItemEntryTransactionType = 'SaleInvoice' | 'Bill' | 'SaleReceipt';

export interface IItemEntryDTO {
  id?: number;
  index?: number;
  itemId: number;
  landedCost?: boolean;
  warehouseId?: number;

  sellAccountId?: number;
  costAccountId?: number; 

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
