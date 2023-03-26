import { Service, Inject } from 'typedi';
import * as R from 'ramda';
import { Knex } from 'knex';
import { AccountNormal, IInventoryLotCost, ILedgerEntry } from '@/interfaces';
import { increment } from 'utils';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import Ledger from '@/services/Accounting/Ledger';
import LedgerStorageService from '@/services/Accounting/LedgerStorageService';
import { groupInventoryTransactionsByTypeId } from '../../Inventory/utils';

@Service()
export class SaleReceiptCostGLEntries {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private ledgerStorage: LedgerStorageService;

  /**
   * Writes journal entries from sales invoices.
   * @param {number} tenantId - The tenant id.
   * @param {Date} startingDate - Starting date.
   * @param {boolean} override
   */
  public writeInventoryCostJournalEntries = async (
    tenantId: number,
    startingDate: Date,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { InventoryCostLotTracker } = this.tenancy.models(tenantId);

    const inventoryCostLotTrans = await InventoryCostLotTracker.query()
      .where('direction', 'OUT')
      .where('transaction_type', 'SaleReceipt')
      .where('cost', '>', 0)
      .modify('filterDateRange', startingDate)
      .orderBy('date', 'ASC')
      .withGraphFetched('receipt')
      .withGraphFetched('item');

    const ledger = this.getInventoryCostLotsLedger(inventoryCostLotTrans);

    // Commit the ledger to the storage.
    await this.ledgerStorage.commit(tenantId, ledger, trx);
  };

  /**
   * Retrieves the inventory cost lots ledger.
   * @param   {} inventoryCostLots
   * @returns {Ledger}
   */
  private getInventoryCostLotsLedger = (
    inventoryCostLots: IInventoryLotCost[]
  ) => {
    // Groups the inventory cost lots transactions.
    const inventoryTransactions =
      groupInventoryTransactionsByTypeId(inventoryCostLots);

    //
    const entries = inventoryTransactions
      .map(this.getSaleInvoiceCostGLEntries)
      .flat();

    return new Ledger(entries);
  };

  /**
   *
   * @param   {IInventoryLotCost} inventoryCostLot
   * @returns {}
   */
  private getInvoiceCostGLCommonEntry = (
    inventoryCostLot: IInventoryLotCost
  ) => {
    return {
      currencyCode: inventoryCostLot.receipt.currencyCode,
      exchangeRate: inventoryCostLot.receipt.exchangeRate,

      transactionType: inventoryCostLot.transactionType,
      transactionId: inventoryCostLot.transactionId,

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
   * Retrieves the inventory cost GL entry.
   * @param   {IInventoryLotCost} inventoryLotCost
   * @returns {ILedgerEntry[]}
   */
  private getInventoryCostGLEntry = R.curry(
    (
      getIndexIncrement,
      inventoryCostLot: IInventoryLotCost
    ): ILedgerEntry[] => {
      const commonEntry = this.getInvoiceCostGLCommonEntry(inventoryCostLot);
      const costAccountId =
        inventoryCostLot.costAccountId || inventoryCostLot.item.costAccountId;

      // XXX Debit - Cost account.
      const costEntry = {
        ...commonEntry,
        debit: inventoryCostLot.cost,
        accountId: costAccountId,
        accountNormal: AccountNormal.DEBIT,
        itemId: inventoryCostLot.itemId,
        index: getIndexIncrement(),
      };
      // XXX Credit - Inventory account.
      const inventoryEntry = {
        ...commonEntry,
        credit: inventoryCostLot.cost,
        accountId: inventoryCostLot.item.inventoryAccountId,
        accountNormal: AccountNormal.DEBIT,
        itemId: inventoryCostLot.itemId,
        index: getIndexIncrement(),
      };
      return [costEntry, inventoryEntry];
    }
  );

  /**
   * Writes journal entries for given sale invoice.
   * -------
   * - Cost of goods sold -> Debit -> YYYY
   *    - Inventory assets -> Credit -> YYYY
   * --------
   * @param {ISaleInvoice} saleInvoice
   * @param {JournalPoster} journal
   */
  public getSaleInvoiceCostGLEntries = (
    inventoryCostLots: IInventoryLotCost[]
  ): ILedgerEntry[] => {
    const getIndexIncrement = increment(0);
    const getInventoryLotEntry =
      this.getInventoryCostGLEntry(getIndexIncrement);

    return inventoryCostLots.map(getInventoryLotEntry).flat();
  };
}
