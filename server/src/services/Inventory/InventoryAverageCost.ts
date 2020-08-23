import { pick } from 'lodash';
import { InventoryTransaction } from '@/models';
import { IInventoryTransaction } from '@/interfaces';
import InventoryCostMethod from '@/services/Inventory/InventoryCostMethod';

export default class InventoryAverageCostMethod extends InventoryCostMethod implements IInventoryCostMethod {
  startingDate: Date;
  itemId: number;
  costTransactions: any[];

  /**
   * Constructor method.
   * @param {Date} startingDate -
   * @param {number} itemId -
   */
  constructor(
    startingDate: Date,
    itemId: number,
  ) {
    super();
  
    this.startingDate = startingDate;
    this.itemId = itemId;
    this.costTransactions = [];
  }

  /**
   * Computes items costs from the given date using average cost method.
   *
   * - Calculate the items average cost in the given date.
   * - Remove the journal entries that associated to the inventory transacions 
   *   after the given date.
   * - Re-compute the inventory transactions and re-write the journal entries 
   *   after the given date.
   * ----------
   * @asycn
   * @param {Date} startingDate 
   * @param {number} referenceId 
   * @param {string} referenceType 
   */
  public async computeItemCost() {
    const openingAvgCost = await this.getOpeningAvaregeCost(this.startingDate, this.itemId);

    const afterInvTransactions: IInventoryTransaction[] = await InventoryTransaction
      .tenant()
      .query()
      .modify('filterDateRange', this.startingDate)  
      .orderBy('date', 'ASC')
      .orderByRaw("FIELD(direction, 'IN', 'OUT')")
      .where('item_id', this.itemId)
      .withGraphFetched('item');

    // Tracking inventroy transactions and retrieve cost transactions
    // based on average rate cost method. 
    const costTransactions = this.trackingCostTransactions(
      afterInvTransactions,
      openingAvgCost,
    );
    await this.storeInventoryLotsCost(costTransactions);
  }

  /**
   * Get items Avarege cost from specific date from inventory transactions.
   * @static
   * @param {Date} startingDate 
   * @return {number}
   */
  public async getOpeningAvaregeCost(startingDate: Date, itemId: number) {
    const commonBuilder = (builder: any) => {
      if (startingDate) {
        builder.where('date', '<', startingDate);
      }
      builder.where('item_id', itemId);
      builder.groupBy('rate');
      builder.groupBy('quantity');
      builder.groupBy('item_id');
      builder.groupBy('direction');
      builder.sum('rate as rate');
      builder.sum('quantity as quantity');
    };
    // Calculates the total inventory total quantity and rate `IN` transactions.

    // @todo total `IN` transactions.
    const inInvSumationOper: Promise<any> = InventoryTransaction.tenant()
      .query()
      .onBuild(commonBuilder)
      .where('direction', 'IN')
      .first();

    // Calculates the total inventory total quantity and rate `OUT` transactions.
    // @todo total `OUT` transactions.
    const outInvSumationOper: Promise<any> = InventoryTransaction.tenant()
      .query()
      .onBuild(commonBuilder)
      .where('direction', 'OUT')
      .first();

    const [inInvSumation, outInvSumation] = await Promise.all([
      inInvSumationOper,
      outInvSumationOper,
    ]);
    return this.computeItemAverageCost(
      inInvSumation?.quantity  || 0,
      inInvSumation?.rate      || 0,
      outInvSumation?.quantity || 0,
      outInvSumation?.rate     || 0
    );
  }

  /**
   * Computes the item average cost.
   * @static 
   * @param {number} quantityIn 
   * @param {number} rateIn 
   * @param {number} quantityOut 
   * @param {number} rateOut 
   */
  public computeItemAverageCost(
    quantityIn: number,
    rateIn: number,

    quantityOut: number,
    rateOut: number,
  ) {
    const totalQuantity = (quantityIn - quantityOut);
    const totalRate = (rateIn - rateOut);
    const averageCost = (totalRate) ? (totalQuantity / totalRate) : totalQuantity;

    return averageCost;
  }

  /**
   * Records the journal entries from specific item inventory transactions.
   * @param {IInventoryTransaction[]} invTransactions 
   * @param {number} openingAverageCost 
   * @param {string} referenceType 
   * @param {number} referenceId 
   * @param {JournalCommand} journalCommands 
   */
  public trackingCostTransactions(
    invTransactions: IInventoryTransaction[],
    openingAverageCost: number,
  ) {
    const costTransactions: any[] = [];
    let accQuantity: number = 0;
    let accCost: number = 0;

    invTransactions.forEach((invTransaction: IInventoryTransaction) => {
      const commonEntry = {
        invTransId: invTransaction.id,
        ...pick(invTransaction, ['date', 'direction', 'itemId', 'quantity', 'rate', 'entryId',
          'transactionId', 'transactionType']),
      };
      switch(invTransaction.direction) {
        case 'IN':
          accQuantity += invTransaction.quantity;
          accCost += invTransaction.rate * invTransaction.quantity;

          costTransactions.push({
            ...commonEntry,
          });
          break;
        case 'OUT':
          const transactionAvgCost = accCost ? (accCost / accQuantity) : 0;
          const averageCost = transactionAvgCost;
          const cost = (invTransaction.quantity * averageCost);
          const income = (invTransaction.quantity * invTransaction.rate);

          accQuantity -= invTransaction.quantity;
          accCost -= income;

          costTransactions.push({
            ...commonEntry,
            cost,
          });
          break;
      }
    });
    return costTransactions;
  }
}