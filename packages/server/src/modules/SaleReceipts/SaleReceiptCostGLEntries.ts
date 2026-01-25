import * as R from 'ramda';
import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { InventoryCostLotTracker } from '../InventoryCost/models/InventoryCostLotTracker';
import { LedgerStorageService } from '../Ledger/LedgerStorage.service';
import { groupInventoryTransactionsByTypeId } from '../InventoryCost/utils';
import { Ledger } from '../Ledger/Ledger';
import { AccountNormal } from '@/interfaces/Account';
import { ILedgerEntry } from '../Ledger/types/Ledger.types';
import { increment } from '@/utils/increment';

@Injectable()
export class SaleReceiptCostGLEntries {
  constructor(
    private readonly ledgerStorage: LedgerStorageService,

    @Inject(InventoryCostLotTracker.name)
    private readonly inventoryCostLotTracker: TenantModelProxy<
      typeof InventoryCostLotTracker
    >,
  ) {}

  /**
   * Writes journal entries from sales receipts.
   * @param {Date} startingDate - Starting date.
   * @param {Knex.Transaction} trx - Transaction.
   */
  public writeInventoryCostJournalEntries = async (
    startingDate: Date,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    const inventoryCostLotTrans = await this.inventoryCostLotTracker()
      .query()
      .where('direction', 'OUT')
      .where('transaction_type', 'SaleReceipt')
      .where('cost', '>', 0)
      .modify('filterDateRange', startingDate)
      .orderBy('date', 'ASC')
      .withGraphFetched('receipt')
      .withGraphFetched('item')
      .withGraphFetched('itemEntry');

    const ledger = this.getInventoryCostLotsLedger(inventoryCostLotTrans);

    await this.ledgerStorage.commit(ledger, trx);
  };

  /**
   * Retrieves the inventory cost lots ledger.
   */
  private getInventoryCostLotsLedger = (
    inventoryCostLots: InventoryCostLotTracker[],
  ) => {
    const inventoryTransactions =
      groupInventoryTransactionsByTypeId(inventoryCostLots);

    const entries = inventoryTransactions
      .map(this.getSaleReceiptCostGLEntries)
      .flat();
    return new Ledger(entries);
  };

  /**
   * Builds the common GL entry fields for a sale receipt cost.
   */
  private getReceiptCostGLCommonEntry = (
    inventoryCostLot: InventoryCostLotTracker,
  ) => {
    return {
      currencyCode: inventoryCostLot.receipt.currencyCode,
      exchangeRate: inventoryCostLot.receipt.exchangeRate,

      transactionType: inventoryCostLot.transactionType,
      transactionId: inventoryCostLot.transactionId,

      transactionNumber: inventoryCostLot.receipt.receiptNumber,
      referenceNumber: inventoryCostLot.receipt.referenceNo,

      date: inventoryCostLot.date,
      indexGroup: 20,
      costable: true,
      createdAt: inventoryCostLot.createdAt,

      debit: 0,
      credit: 0,

      branchId: inventoryCostLot.receipt.branchId,
    };
  };

  /**
   * Retrieves the inventory cost GL entry for a single lot.
   */
  private getInventoryCostGLEntry = R.curry(
    (
      getIndexIncrement: () => number,
      inventoryCostLot: InventoryCostLotTracker,
    ): ILedgerEntry[] => {
      const commonEntry = this.getReceiptCostGLCommonEntry(inventoryCostLot);
      const costAccountId =
        inventoryCostLot.costAccountId || inventoryCostLot.item.costAccountId;

      const description = inventoryCostLot.itemEntry?.description || null;

      const costEntry = {
        ...commonEntry,
        debit: inventoryCostLot.cost,
        accountId: costAccountId,
        accountNormal: AccountNormal.DEBIT,
        itemId: inventoryCostLot.itemId,
        note: description,
        index: getIndexIncrement(),
      };

      const inventoryEntry = {
        ...commonEntry,
        credit: inventoryCostLot.cost,
        accountId: inventoryCostLot.item.inventoryAccountId,
        accountNormal: AccountNormal.DEBIT,
        itemId: inventoryCostLot.itemId,
        note: description,
        index: getIndexIncrement(),
      };
      return [costEntry, inventoryEntry];
    },
  );

  /**
   * Builds GL entries for a group of sale receipt cost lots.
   * - Cost of goods sold -> Debit
   * - Inventory assets -> Credit
   */
  public getSaleReceiptCostGLEntries = (
    inventoryCostLots: InventoryCostLotTracker[],
  ): ILedgerEntry[] => {
    const getIndexIncrement = increment(0);
    const getInventoryLotEntry =
      this.getInventoryCostGLEntry(getIndexIncrement);

    return inventoryCostLots.map((t) => getInventoryLotEntry(t)).flat();
  };
}
