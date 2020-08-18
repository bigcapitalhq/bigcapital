import { Account, InventoryTransaction } from '@/models';
import { IInventoryTransaction } from '@/interfaces';
import JournalPoster from '@/services/Accounting/JournalPoster';
import JournalCommands from '@/services/Accounting/JournalCommands';

export default class InventoryAverageCostMethod implements IInventoryCostMethod {
  journal: JournalPoster;
  journalCommands: JournalCommands;
  fromDate: Date;
  itemId: number;

  /**
   * Constructor method.
   * @param {Date} fromDate -
   * @param {number} itemId -
   */
  constructor(
    fromDate: Date,
    itemId: number,
  ) {
    this.fromDate = fromDate;
    this.itemId = itemId;
  }

  /**
   * Initialize the inventory average cost method.
   * @async
   */
  async initialize() {
    const accountsDepGraph = await Account.tenant().depGraph().query();

    this.journal = new JournalPoster(accountsDepGraph);
    this.journalCommands = new JournalCommands(this.journal);
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
   * @param {Date} fromDate 
   * @param {number} referenceId 
   * @param {string} referenceType 
   */
  public async computeItemCost() {
    const openingAvgCost = await this.getOpeningAvaregeCost(this.fromDate, this.itemId);

    // @todo from `invTransactions`.
    const afterInvTransactions: IInventoryTransaction[] = await InventoryTransaction
      .tenant()
      .query()
      .where('date', '>=', this.fromDate)
      // .where('direction', 'OUT')
      .orderBy('date', 'asc')
      .withGraphFetched('item');

    // Remove and revert accounts balance journal entries from 
    // inventory transactions.
    await this.journalCommands
      .revertEntriesFromInventoryTransactions(afterInvTransactions);

    // Re-write the journal entries from the new recorded inventory transactions.
    await this.jEntriesFromItemInvTransactions(
      afterInvTransactions,
      openingAvgCost,
    );
    // Saves the new recorded journal entries to the storage.
    await Promise.all([
      this.journal.deleteEntries(),
      this.journal.saveEntries(),
      this.journal.saveBalance(),
    ]);
  }

  /**
   * Get items Avarege cost from specific date from inventory transactions.
   * @static
   * @param {Date} fromDate 
   * @return {number}
   */
  public async getOpeningAvaregeCost(fromDate: Date, itemId: number) {
    const commonBuilder = (builder: any) => {
      if (fromDate) {
        builder.where('date', '<', fromDate);
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
  async jEntriesFromItemInvTransactions(
    invTransactions: IInventoryTransaction[],
    openingAverageCost: number,
  ) {
    const transactions: any[] = [];
    let accQuantity: number = 0;
    let accCost: number = 0;

    invTransactions.forEach((invTransaction: IInventoryTransaction) => {
      const commonEntry = {
        date: invTransaction.date,
        referenceType: invTransaction.transactionType,
        referenceId: invTransaction.transactionId,
      };
      switch(invTransaction.direction) {
        case 'IN':
          accQuantity += invTransaction.quantity;
          accCost += invTransaction.rate * invTransaction.quantity;

          const inventory = invTransaction.quantity * invTransaction.rate;

          transactions.push({
            ...commonEntry,
            inventory,
            inventoryAccount: invTransaction.item.inventoryAccountId,
          });
          break;
        case 'OUT': 
          const income = invTransaction.quantity * invTransaction.rate;
          const transactionAvgCost = accCost ? (accCost / accQuantity) : 0;
          const averageCost = transactionAvgCost;
          const cost = (invTransaction.quantity * averageCost);          

          accQuantity -= invTransaction.quantity;
          accCost -= accCost;

          transactions.push({
            ...commonEntry,
            income,
            cost,
            incomeAccount: invTransaction.item.sellAccountId,
            costAccount: invTransaction.item.costAccountId,
            inventoryAccount: invTransaction.item.inventoryAccountId,
          });
          break;
      }
    });
    this.journalCommands.inventoryEntries(transactions);
  }
}