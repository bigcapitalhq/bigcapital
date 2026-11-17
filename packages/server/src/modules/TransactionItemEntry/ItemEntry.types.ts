export type IItemEntryTransactionType =
  | 'SaleInvoice'
  | 'Bill'
  | 'SaleReceipt'
  | 'CreditNote'
  | 'VendorCredit';

export type DocumentBatchDirection = 'in' | 'out';

/**
 * The batch movement of a document item entry.
 */
export interface IDocumentBatch {
  batchId: number;
  batchNumber: string;
  batchRef?: string | null;
  expiryDate?: string | null;
  quantity: number;
  itemId: number;
  itemName: string;
  direction: DocumentBatchDirection;
}

export interface IItemEntryDTO {
  id?: number;
  index?: number;
  itemId: number;
  landedCost?: boolean;
  warehouseId?: number;
  batchId?: number;
  batches?: Array<{ batchId: number; quantity: number }>;

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
