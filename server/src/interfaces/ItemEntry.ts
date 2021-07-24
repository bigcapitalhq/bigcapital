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
}

export interface IItemEntryDTO {
  id?: number,
  landedCost?: boolean;
}
