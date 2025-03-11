import { pick } from 'lodash';
import { Knex } from 'knex';
import { InventoryTransaction } from '../models/InventoryTransaction';

export class InventoryAverageCostMethod {
  /**
   * Constructor method.
   * @param {number} tenantId - The given tenant id.
   * @param {Date} startingDate -
   * @param {number} itemId - The given inventory item id.
   */
  constructor() {}

  /**
   * Computes the cost of the given rate and quantity.
   * @param {number} rate - The given rate.
   * @param {number} quantity - The given quantity.
   * @returns {number}
   */
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
    invTransactions: InventoryTransaction[],
    openingQuantity: number = 0,
    openingCost: number = 0,
  ) {
    const costTransactions: any[] = [];

    // Cumulative item quantity and cost. This will decrement after
    // each out transactions depends on its quantity and cost.
    let accQuantity: number = openingQuantity;
    let accCost: number = openingCost;

    invTransactions.forEach((invTransaction: InventoryTransaction) => {
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
            invTransaction.quantity,
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
              0,
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
}
