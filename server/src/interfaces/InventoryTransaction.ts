

export interface IInventoryTransaction {
  id?: number,
  date: Date,
  direction: string,
  itemId: number,
  quantity: number,
  rate: number,
  transactionType: string,
  transactionId: string,
};

export interface IInventoryLotCost {
  id?: number,
  date: Date,
  direction: string,
  itemId: number,
  rate: number,
  remaining: number,
  transactionType: string,
  transactionId: string,
}