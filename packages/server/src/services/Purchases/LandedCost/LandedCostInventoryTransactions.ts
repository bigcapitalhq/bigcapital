import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { IBill, IBillLandedCostTransaction } from '@/interfaces';
import InventoryService from '@/services/Inventory/Inventory';
import { mergeLocatedWithBillEntries } from './utils';

@Service()
export default class LandedCostInventoryTransactions {
  @Inject()
  public inventoryService: InventoryService;

  /**
   * Records inventory transactions.
   * @param {number} tenantId
   * @param {IBillLandedCostTransaction} billLandedCost
   * @param {IBill} bill -
   */
  public recordInventoryTransactions = async (
    tenantId: number,
    billLandedCost: IBillLandedCostTransaction,
    bill: IBill,
    trx?: Knex.Transaction
  ) => {
    // Retrieve the merged allocated entries with bill entries.
    const allocateEntries = mergeLocatedWithBillEntries(
      billLandedCost.allocateEntries,
      bill.entries
    );
    // Maps the allocate cost entries to inventory transactions.
    const inventoryTransactions = allocateEntries.map((allocateEntry) => ({
      date: bill.billDate,
      itemId: allocateEntry.entry.itemId,
      direction: 'IN',
      quantity: null,
      rate: allocateEntry.cost,
      transactionType: 'LandedCost',
      transactionId: billLandedCost.id,
      entryId: allocateEntry.entryId,
    }));
    // Writes inventory transactions.
    return this.inventoryService.recordInventoryTransactions(
      tenantId,
      inventoryTransactions,
      false,
      trx
    );
  };

  /**
   * Deletes the inventory transaction.
   * @param {number} tenantId - Tenant id.
   * @param {number} landedCostId - Landed cost id.
   * @param {Knex.Transaction} trx - Knex transactions.
   * @returns
   */
  public removeInventoryTransactions = (
    tenantId: number,
    landedCostId: number,
    trx?: Knex.Transaction
  ) => {
    return this.inventoryService.deleteInventoryTransactions(
      tenantId,
      landedCostId,
      'LandedCost',
      trx
    );
  };
}
