

interface IInventoryCostMethod {
  computeItemsCost(fromDate: Date): void,
  storeInventoryLotsCost(transactions: any[]): void,
}