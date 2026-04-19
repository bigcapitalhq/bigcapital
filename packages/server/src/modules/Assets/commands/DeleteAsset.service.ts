import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import { Asset } from '../models/Asset.model';
import { AssetRepository } from '../repositories/Asset.repository';
import { AssetDepreciationEntryRepository } from '../repositories/AssetDepreciationEntry.repository';
import { events } from '@/common/events/events';

@Injectable()
export class DeleteAssetService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly depreciationEntryRepository: AssetDepreciationEntryRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Deletes an asset.
   */
  public async deleteAsset(
    assetId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const asset = await this.assetRepository.findById(assetId);
    if (!asset) {
      throw new NotFoundException(`Asset with id ${assetId} not found`);
    }

    // Check if asset has posted depreciation entries
    const postedEntries = await this.depreciationEntryRepository.model
      .query()
      .where('assetId', assetId)
      .where('isPosted', true)
      .first();

    if (postedEntries) {
      throw new Error('Cannot delete asset with posted depreciation entries');
    }

    // Delete unposted depreciation entries first
    await this.depreciationEntryRepository.deleteUnpostedEntries(assetId);

    // Delete the asset within transaction if provided
    const deleteQuery = trx
      ? this.assetRepository.model.query(trx).deleteById(assetId)
      : this.assetRepository.model.query().deleteById(assetId);

    await deleteQuery;

    // Emit event
    this.eventEmitter.emit(events.assets.onDeleted, {
      assetId,
      trx,
    });
  }

  /**
   * Bulk delete assets.
   */
  public async bulkDeleteAssets(
    assetIds: number[],
    trx?: Knex.Transaction,
  ): Promise<void> {
    for (const assetId of assetIds) {
      await this.deleteAsset(assetId, trx);
    }
  }
}
