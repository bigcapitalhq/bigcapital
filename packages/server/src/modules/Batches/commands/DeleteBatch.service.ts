import { Inject, Injectable } from '@nestjs/common';
import { Batch } from '../models/Batch';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { ItemEntryBatch } from '@/modules/TransactionItemEntry/models/ItemEntryBatch';
import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { BatchesValidators } from '../BatchesValidators.service';
import { BATCHES_ERRORS } from '../types/Batches.types';

@Injectable()
export class DeleteBatchService {
  /**
   * @param {TenantModelProxy<typeof Batch>} batchModel
   * @param {TenantModelProxy<typeof ItemEntry>} itemEntryModel
   * @param {TenantModelProxy<typeof InventoryTransaction>} inventoryTransactionModel
   * @param {BatchesValidators} validators
   */
  constructor(
    @Inject(Batch.name)
    private readonly batchModel: TenantModelProxy<typeof Batch>,

    @Inject(ItemEntry.name)
    private readonly itemEntryModel: TenantModelProxy<typeof ItemEntry>,

    @Inject(ItemEntryBatch.name)
    private readonly itemEntryBatchModel: TenantModelProxy<
      typeof ItemEntryBatch
    >,

    @Inject(InventoryTransaction.name)
    private readonly inventoryTransactionModel: TenantModelProxy<
      typeof InventoryTransaction
    >,

    private readonly validators: BatchesValidators,
  ) {}

  /**
   * Deletes the given batch when it has no associated transactions.
   */
  public async deleteBatch(id: number): Promise<void> {
    const batch = await this.batchModel().query().findById(id);
    this.validators.validateBatchExistance(batch);

    const transactionsCount = await this.inventoryTransactionModel()
      .query()
      .where('batchId', id)
      .resultSize();

    const entriesCount = await this.itemEntryModel()
      .query()
      .where('batchId', id)
      .resultSize();

    const allocationsCount = await this.itemEntryBatchModel()
      .query()
      .where('batchId', id)
      .resultSize();

    if (transactionsCount > 0 || entriesCount > 0 || allocationsCount > 0) {
      throw new ServiceError(BATCHES_ERRORS.BATCH_HAS_ASSOCIATED_TRANSACTIONS);
    }
    await this.batchModel().query().deleteById(id);
  }
}
