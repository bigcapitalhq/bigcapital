
export type TInventoryTransactionDirection = 'IN' | 'OUT';

export interface IInventoryTransaction {
  id?: number,
  date: Date,
  direction: TInventoryTransactionDirection,
  itemId: number,
  quantity: number,
  rate: number,
  transactionType: string,
  transactionId: number,
  lotNumber: string,
  entryId: number,
  createdAt?: Date,
  updatedAt?: Date,
};

export interface IInventoryLotCost {
  id?: number,
  date: Date,
  direction: string,
  itemId: number,
  quantity: number,
  rate: number,
  remaining: number,
  cost: number,
  lotNumber: string|number,
  transactionType: string,
  transactionId: number,
  entryId: number
}