import { pick } from 'lodash';
import { Knex } from 'knex';
import { IInventoryTransaction } from '@/interfaces';
import InventoryCostMethod from '@/services/Inventory/InventoryCostMethod';

export default class InventoryAverageCostMethod
  extends InventoryCostMethod
  implements IInventoryCostMethod
{
  startingDate: Date;
  itemId: number;
  costTransactions: any[];
  trx: Knex.Transaction;

  /**
   * Constructor method.
   * @param {number} tenantId - The given tenant id.
   * @param {Date} startingDate -
   * @param {number} itemId - The given inventory item id.
   */
  constructor(
    tenantId: number,
    startingDate: Date,
    itemId: number,
    trx?: Knex.Transaction
  ) {
    super(tenantId, startingDate, itemId);

    this.trx = trx;
    this.startingDate = startingDate;
    this.itemId = itemId;
    this.costTransactions = [];
  }

  /**
   * Computes items costs from the given date using average cost method.
   * ----------
   * - Calculate the items average cost in the given date.
   * - Remove the journal entries that associated to the inventory transacions
   *   after the given date.
   * - Re-compute the inventory transactions and re-write the journal entries
   *   after the given date.
   * ----------
   * @async
   * @param {Date} startingDate
   * @param {number} referenceId
   * @param {string} referenceType
   */
  public async computeItemCost() {
    const { InventoryTransaction } = this.tenantModels;
    const { averageCost, openingQuantity, openingCost } =
      await this.getOpeningAverageCost(this.startingDate, this.itemId);

    const afterInvTransactions: IInventoryTransaction[] =
      await InventoryTransaction.query()
        .modify('filterDateRange', this.startingDate)
        .orderBy('date', 'ASC')
        .orderByRaw("FIELD(direction, 'IN', 'OUT')")
        .orderBy('createdAt', 'ASC')
        .where('item_id', this.itemId)
        .withGraphFetched('item');

    // Tracking inventory transactions and retrieve cost transactions based on
    // average rate cost method.
    const costTransactions = this.trackingCostTransactions(
      afterInvTransactions,
      openingQuantity,
      openingCost
    );
    // Revert the inventory out lots transactions
    await this.revertTheInventoryOutLotTrans();

    // Store inventory lots cost transactions.
    await this.storeInventoryLotsCost(costTransactions);
  }

  /**
   * Get items Average cost from specific date from inventory transactions.
   * @async
   * @param {Date} closingDate
   * @return {number}
   */
  public async getOpeningAverageCost(closingDate: Date, itemId: number) {
    const { InventoryCostLotTracker } = this.tenantModels;

    const commonBuilder = (builder: any) => {
      if (closingDate) {
        builder.where('date', '<', closingDate);
      }
      builder.where('item_id', itemId);
      builder.sum('rate as rate');
      builder.sum('quantity as quantity');
      builder.sum('cost as cost');
      builder.first();
    };
    // Calculates the total inventory total quantity and rate `IN` transactions.
    const inInvSumationOper: Promise<any> = InventoryCostLotTracker.query()
      .onBuild(commonBuilder)
      .where('direction', 'IN');

    // Calculates the total inventory total quantity and rate `OUT` transactions.
    const outInvSumationOper: Promise<any> = InventoryCostLotTracker.query()
      .onBuild(commonBuilder)
      .where('direction', 'OUT');

    const [inInvSumation, outInvSumation] = await Promise.all([
      inInvSumationOper,
      outInvSumationOper,
    ]);
    return this.computeItemAverageCost(
      inInvSumation?.cost || 0,
      inInvSumation?.quantity || 0,
      outInvSumation?.cost || 0,
      outInvSumation?.quantity || 0
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
    totalCostIn: number,
    totalQuantityIn: number,

    totalCostOut: number,
    totalQuantityOut: number
  ) {
    const openingCost = totalCostIn - totalCostOut;
    const openingQuantity = totalQuantityIn - totalQuantityOut;

    const averageCost = openingQuantity ? openingCost / openingQuantity : 0;

    return { averageCost, openingCost, openingQuantity };
  }

  private getCost(rate: number, quantity: number) {
    return quantity ? rate * quantity : rate;
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
    openingQuantity: number = 0,
    openingCost: number = 0
  ) {
    const costTransactions: any[] = [];

    // Cumulative item quantity and cost. This will decrement after
    // each out transactions depends on its quantity and cost.
    let accQuantity: number = openingQuantity;
    let accCost: number = openingCost;

    invTransactions.forEach((invTransaction: IInventoryTransaction) => {
      const commonEntry = {
        invTransId: invTransaction.id,
        ...pick(invTransaction, [
          'date',
          'direction',
          'itemId',
          'quantity',
          'rate',
          'entryId',
          'transactionId',
          'transactionType',
          'createdAt',
          'costAccountId',
          'branchId',
          'warehouseId',
        ]),
        inventoryTransactionId: invTransaction.id,
      };
      switch (invTransaction.direction) {
        case 'IN':
          const inCost = this.getCost(
            invTransaction.rate,
            invTransaction.quantity
          );
          // Increases the quantity and cost in `IN` inventory transactions.
          accQuantity += invTransaction.quantity;
          accCost += inCost;

          costTransactions.push({
            ...commonEntry,
            cost: inCost,
          });
          break;
        case 'OUT':
          // Average cost = Total cost / Total quantity
          const averageCost = accQuantity ? accCost / accQuantity : 0;

          const quantity =
            accQuantity > 0
              ? Math.min(invTransaction.quantity, accQuantity)
              : invTransaction.quantity;

          // Cost = the transaction quantity * Average cost.
          const cost = this.getCost(averageCost, quantity);

          // Revenue = transaction quanity * rate.
          // const revenue = quantity * invTransaction.rate;
          costTransactions.push({
            ...commonEntry,
            quantity,
            cost,
          });
          accQuantity = Math.max(accQuantity - quantity, 0);
          accCost = Math.max(accCost - cost, 0);

          if (invTransaction.quantity > quantity) {
            const remainingQuantity = Math.max(
              invTransaction.quantity - quantity,
              0
            );
            const remainingIncome = remainingQuantity * invTransaction.rate;

            costTransactions.push({
              ...commonEntry,
              quantity: remainingQuantity,
              cost: 0,
            });
            accQuantity = Math.max(accQuantity - remainingQuantity, 0);
            accCost = Math.max(accCost - remainingIncome, 0);
          }
          break;
      }
    });
    return costTransactions;
  }

  /**
   * Reverts the inventory lots `OUT` transactions.
   * @param {Date} openingDate - Opening date.
   * @param {number} itemId - Item id.
   * @returns {Promise<void>}
   */
  async revertTheInventoryOutLotTrans(): Promise<void> {
    const { InventoryCostLotTracker } = this.tenantModels;

    await InventoryCostLotTracker.query(this.trx)
      .modify('filterDateRange', this.startingDate)
      .orderBy('date', 'DESC')
      .where('item_id', this.itemId)
      .delete();
  }
}
