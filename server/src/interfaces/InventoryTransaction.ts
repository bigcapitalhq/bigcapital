

export interface IInventoryTransaction {
  id?: number,
  date: Date,
  direction: string,
  itemId: number,
  quantity: number,
  rate: number,
  transactionType: string,
  transactionId: string,
  lotNumber: string,
};

export interface IInventoryLotCost {
  id?: number,
  date: Date,
  direction: string,
  itemId: number,
  rate: number,
  remaining: number,
  lotNumber: string|number,
  transactionType: string,
  transactionId: string,
}