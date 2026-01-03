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
export class SaleInvoiceCostGLEntries {
  constructor(
    private readonly ledgerStorage: LedgerStorageService,

    @Inject(InventoryCostLotTracker.name)
    private readonly inventoryCostLotTracker: TenantModelProxy<
      typeof InventoryCostLotTracker
    >,
  ) { }

  /**
   * Writes journal entries from sales invoices.
   * @param {Date} startingDate - Starting date.
   * @param {boolean} override
   */
  public writeInventoryCostJournalEntries = async (
    startingDate: Date,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    const inventoryCostLotTrans = await this.inventoryCostLotTracker()
      .query()
      .where('direction', 'OUT')
      .where('transaction_type', 'SaleInvoice')
      .where('cost', '>', 0)
      .modify('filterDateRange', startingDate)
      .orderBy('date', 'ASC')
      .withGraphFetched('invoice')
      .withGraphFetched('item')
      .withGraphFetched('itemEntry');

    const ledger = this.getInventoryCostLotsLedger(inventoryCostLotTrans);

    // Commit the ledger to the storage.
    await this.ledgerStorage.commit(ledger, trx);
  };

  /**
   * Retrieves the inventory cost lots ledger.
   * @param   {IInventoryLotCost[]} inventoryCostLots
   * @returns {Ledger}
   */
  private getInventoryCostLotsLedger = (
    inventoryCostLots: InventoryCostLotTracker[],
  ) => {
    // Groups the inventory cost lots transactions.
    const inventoryTransactions =
      groupInventoryTransactionsByTypeId(inventoryCostLots);

    const entries = inventoryTransactions
      .map(this.getSaleInvoiceCostGLEntries)
      .flat();
    return new Ledger(entries);
  };

  /**
   *
   * @param {IInventoryLotCost} inventoryCostLot
   * @returns {}
   */
  private getInvoiceCostGLCommonEntry = (
    inventoryCostLot: InventoryCostLotTracker,
  ) => {
    return {
      currencyCode: inventoryCostLot.invoice.currencyCode,
      exchangeRate: inventoryCostLot.invoice.exchangeRate,

      transactionType: inventoryCostLot.transactionType,
      transactionId: inventoryCostLot.transactionId,

      transactionNumber: inventoryCostLot.invoice.invoiceNo,
      referenceNumber: inventoryCostLot.invoice.referenceNo,

      date: inventoryCostLot.date,
      indexGroup: 20,
      costable: true,
      createdAt: inventoryCostLot.createdAt,

      debit: 0,
      credit: 0,

      branchId: inventoryCostLot.invoice.branchId,
    };
  };

  /**
   * Retrieves the inventory cost GL entry.
   * @param {IInventoryLotCost} inventoryLotCost
   * @returns {ILedgerEntry[]}
   */
  private getInventoryCostGLEntry = R.curry(
    (
      getIndexIncrement,
      inventoryCostLot: InventoryCostLotTracker,
    ): ILedgerEntry[] => {
      const commonEntry = this.getInvoiceCostGLCommonEntry(inventoryCostLot);
      const costAccountId =
        inventoryCostLot.costAccountId || inventoryCostLot.item.costAccountId;

      // Get description from item entry if available
      const description = inventoryCostLot.itemEntry?.description || null;

      // XXX Debit - Cost account.
      const costEntry = {
        ...commonEntry,
        debit: inventoryCostLot.cost,
        accountId: costAccountId,
        accountNormal: AccountNormal.DEBIT,
        itemId: inventoryCostLot.itemId,
        note: description,
        index: getIndexIncrement(),
      };
      // XXX Credit - Inventory account.
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
   * Writes journal entries for given sale invoice.
   * -----
   * - Cost of goods sold -> Debit -> YYYY
   *    - Inventory assets -> Credit -> YYYY
   *-----
   * @param {ISaleInvoice} saleInvoice
   * @param {JournalPoster} journal
   */
  public getSaleInvoiceCostGLEntries = (
    inventoryCostLots: InventoryCostLotTracker[],
  ): ILedgerEntry[] => {
    const getIndexIncrement = increment(0);
    const getInventoryLotEntry =
      this.getInventoryCostGLEntry(getIndexIncrement);

    return inventoryCostLots.map((t) => getInventoryLotEntry(t)).flat();
  };
}
