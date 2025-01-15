import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { LedgerStorageService } from '../../../Ledger/LedgerStorage.service';
import { InventoryAdjustment } from '../../models/InventoryAdjustment';
import { TenancyContext } from '../../../Tenancy/TenancyContext.service';
import { InventoryAdjustmentsGL } from './InventoryAdjustmentGL';

@Injectable()
export class InventoryAdjustmentsGLEntries {
  constructor(
    private readonly ledgerStorage: LedgerStorageService,
    private readonly tenancyContext: TenancyContext,

    @Inject(InventoryAdjustment.name)
    private readonly inventoryAdjustment: typeof InventoryAdjustment,
  ) {}

  /**
   * Writes inventory increment adjustment GL entries.
   * @param {number} inventoryAdjustmentId - Inventory adjustment ID.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  public writeAdjustmentGLEntries = async (
    inventoryAdjustmentId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    // Retrieves the inventory adjustment with associated entries.
    const adjustment = await this.inventoryAdjustment.query(trx)
      .findById(inventoryAdjustmentId)
      .withGraphFetched('entries.item');

    const tenantMeta = await this.tenancyContext.getTenantMetadata();

    // Retrieves the inventory adjustment GL entries.
    const ledger = new InventoryAdjustmentsGL(adjustment)
      .setBaseCurrency(tenantMeta.baseCurrency)
      .getAdjustmentGL();

    // Commits the ledger entries to the storage.
    await this.ledgerStorage.commit(ledger, trx);
  };

  /**
   * Reverts the adjustment transactions GL entries.
   * @param   {number} tenantId
   * @param   {number} inventoryAdjustmentId
   * @returns {Promise<void>}
   */
  public revertAdjustmentGLEntries = (
    inventoryAdjustmentId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    return this.ledgerStorage.deleteByReference(
      inventoryAdjustmentId,
      'InventoryAdjustment',
      trx,
    );
  };

  /**
   * Rewrite inventory adjustment GL entries.
   * @param {number} tenantId
   * @param {number} inventoryAdjustmentId
   * @param {Knex.Transaction} trx
   */
  public rewriteAdjustmentGLEntries = async (
    inventoryAdjustmentId: number,
    trx?: Knex.Transaction,
  ) => {
    // Reverts GL entries of the given inventory adjustment.
    await this.revertAdjustmentGLEntries(inventoryAdjustmentId, trx);

    // Writes GL entries of th egiven inventory adjustment.
    await this.writeAdjustmentGLEntries(inventoryAdjustmentId, trx);
  };
}
