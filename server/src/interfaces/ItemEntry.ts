
export type IItemEntryTransactionType = 'SaleInvoice' | 'Bill' | 'SaleReceipt';

export interface IItemEntry {
  id?: number,

  referenceType: string,
  referenceId: number,

  index: number,

  itemId: number,
  description: string,
  discount: number,
  quantity: number,
  rate: number,

  sellAccountId: number,
  costAccountId: number,

  landedCost?: boolean,
}

export interface IItemEntryDTO {
  landedCost?: boolean
}