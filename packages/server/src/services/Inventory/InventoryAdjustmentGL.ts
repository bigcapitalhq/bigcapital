import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import * as R from 'ramda';
import TenancyService from '@/services/Tenancy/TenancyService';
import {
  AccountNormal,
  IInventoryAdjustment,
  IInventoryAdjustmentEntry,
  ILedgerEntry,
} from '@/interfaces';
import Ledger from '@/services/Accounting/Ledger';
import LedgerStorageService from '@/services/Accounting/LedgerStorageService';
import { TenantMetadata } from '@/system/models';

@Service()
export default class InventoryAdjustmentsGL {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private ledgerStorage: LedgerStorageService;

  /**
   * Retrieves the inventory adjustment common GL entry.
   * @param   {InventoryAdjustment} inventoryAdjustment -
   * @param   {string} baseCurrency -
   * @returns {ILedgerEntry}
   */
  private getAdjustmentGLCommonEntry = (
    inventoryAdjustment: IInventoryAdjustment,
    baseCurrency: string
  ) => {
    return {
      currencyCode: baseCurrency,
      exchangeRate: 1,

      transactionId: inventoryAdjustment.id,
      transactionType: 'InventoryAdjustment',
      referenceNumber: inventoryAdjustment.referenceNo,

      date: inventoryAdjustment.date,

      userId: inventoryAdjustment.userId,
      branchId: inventoryAdjustment.branchId,

      createdAt: inventoryAdjustment.createdAt,

      credit: 0,
      debit: 0,
    };
  };

  /**
   * Retrieve the inventory adjustment inventory GL entry.
   * @param   {IInventoryAdjustment} inventoryAdjustment -Inventory adjustment model.
   * @param   {string} baseCurrency - Base currency of the organization.
   * @param   {IInventoryAdjustmentEntry} entry -
   * @param   {number} index -
   * @returns {ILedgerEntry}
   */
  private getAdjustmentGLInventoryEntry = R.curry(
    (
      inventoryAdjustment: IInventoryAdjustment,
      baseCurrency: string,
      entry: IInventoryAdjustmentEntry,
      index: number
    ): ILedgerEntry => {
      const commonEntry = this.getAdjustmentGLCommonEntry(
        inventoryAdjustment,
        baseCurrency
      );
      const amount = entry.cost * entry.quantity;

      return {
        ...commonEntry,
        debit: amount,
        accountId: entry.item.inventoryAccountId,
        accountNormal: AccountNormal.DEBIT,
        index,
      };
    }
  );

  /**
   * Retrieves the inventory adjustment
   * @param   {IInventoryAdjustment} inventoryAdjustment
   * @param   {IInventoryAdjustmentEntry} entry
   * @returns {ILedgerEntry}
   */
  private getAdjustmentGLCostEntry = R.curry(
    (
      inventoryAdjustment: IInventoryAdjustment,
      baseCurrency: string,
      entry: IInventoryAdjustmentEntry,
      index: number
    ): ILedgerEntry => {
      const commonEntry = this.getAdjustmentGLCommonEntry(
        inventoryAdjustment,
        baseCurrency
      );
      const amount = entry.cost * entry.quantity;

      return {
        ...commonEntry,
        accountId: inventoryAdjustment.adjustmentAccountId,
        accountNormal: AccountNormal.DEBIT,
        credit: amount,
        index: index + 2,
      };
    }
  );

  /**
   * Retrieve the inventory adjustment GL item entry.
   * @param {InventoryAdjustment} adjustment
   * @param {string} baseCurrency
   * @param {InventoryAdjustmentEntry} entry
   * @param {number} index
   * @returns {}
   */
  private getAdjustmentGLItemEntry = R.curry(
    (
      adjustment: IInventoryAdjustment,
      baseCurrency: string,
      entry: IInventoryAdjustmentEntry,
      index: number
    ): ILedgerEntry[] => {
      const getInventoryEntry = this.getAdjustmentGLInventoryEntry(
        adjustment,
        baseCurrency
      );
      const inventoryEntry = getInventoryEntry(entry, index);
      const costEntry = this.getAdjustmentGLCostEntry(
        adjustment,
        baseCurrency,
        entry,
        index
      );
      return [inventoryEntry, costEntry];
    }
  );

  /**
   * Writes increment inventory adjustment GL entries.
   * @param   {InventoryAdjustment} inventoryAdjustment -
   * @param   {JournalPoster} jorunal -
   * @returns {ILedgerEntry[]}
   */
  public getIncrementAdjustmentGLEntries(
    inventoryAdjustment: IInventoryAdjustment,
    baseCurrency: string
  ): ILedgerEntry[] {
    const getItemEntry = this.getAdjustmentGLItemEntry(
      inventoryAdjustment,
      baseCurrency
    );
    return inventoryAdjustment.entries.map(getItemEntry).flat();
  }

  /**
   * Writes inventory increment adjustment GL entries.
   * @param {number} tenantId
   * @param {number} inventoryAdjustmentId
   */
  public writeAdjustmentGLEntries = async (
    tenantId: number,
    inventoryAdjustmentId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { InventoryAdjustment } = this.tenancy.models(tenantId);

    // Retrieves the inventory adjustment with associated entries.
    const adjustment = await InventoryAdjustment.query(trx)
      .findById(inventoryAdjustmentId)
      .withGraphFetched('entries.item');

    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });

    // Retrieves the inventory adjustment GL entries.
    const entries = this.getIncrementAdjustmentGLEntries(
      adjustment,
      tenantMeta.baseCurrency
    );
    const ledger = new Ledger(entries);

    // Commits the ledger entries to the storage.
    await this.ledgerStorage.commit(tenantId, ledger, trx);
  };

  /**
   * Reverts the adjustment transactions GL entries.
   * @param   {number} tenantId
   * @param   {number} inventoryAdjustmentId
   * @returns {Promise<void>}
   */
  public revertAdjustmentGLEntries = (
    tenantId: number,
    inventoryAdjustmentId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    return this.ledgerStorage.deleteByReference(
      tenantId,
      inventoryAdjustmentId,
      'InventoryAdjustment',
      trx
    );
  };

  /**
   * Rewrite inventory adjustment GL entries.
   * @param {number} tenantId
   * @param {number} inventoryAdjustmentId
   * @param {Knex.Transaction} trx
   */
  public rewriteAdjustmentGLEntries = async (
    tenantId: number,
    inventoryAdjustmentId: number,
    trx?: Knex.Transaction
  ) => {
    // Reverts GL entries of the given inventory adjustment.
    await this.revertAdjustmentGLEntries(tenantId, inventoryAdjustmentId, trx);

    // Writes GL entries of th egiven inventory adjustment.
    await this.writeAdjustmentGLEntries(tenantId, inventoryAdjustmentId, trx);
  };
}
