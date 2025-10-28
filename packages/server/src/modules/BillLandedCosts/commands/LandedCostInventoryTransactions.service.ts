import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { IBillLandedCostTransaction } from '../types/BillLandedCosts.types';
import { Bill } from '@/modules/Bills/models/Bill';
import { mergeLocatedWithBillEntries } from '../utils';
import { InventoryTransactionsService } from '@/modules/InventoryCost/commands/InventoryTransactions.service';

@Injectable()
export class LandedCostInventoryTransactions {
  constructor(
    private readonly inventoryTransactionsService: InventoryTransactionsService,
  ) {}

  /**
   * Records inventory transactions.
   * @param {number} tenantId
   * @param {IBillLandedCostTransaction} billLandedCost
   * @param {IBill} bill -
   */
  public recordInventoryTransactions = async (
    billLandedCost: IBillLandedCostTransaction,
    bill: Bill,
    trx?: Knex.Transaction,
  ) => {
    // Retrieve the merged allocated entries with bill entries.
    const allocateEntries = mergeLocatedWithBillEntries(
      billLandedCost.allocateEntries,
      bill.entries,
    );
    // Mappes the allocate cost entries to inventory transactions.
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
    return this.inventoryTransactionsService.recordInventoryTransactions(
      inventoryTransactions,
      false,
      trx,
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
    landedCostId: number,
    trx?: Knex.Transaction,
  ) => {
    return this.inventoryTransactionsService.deleteInventoryTransactions(
      landedCostId,
      'LandedCost',
      trx,
    );
  };
}
