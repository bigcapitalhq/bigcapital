import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import { Asset } from '../models/Asset.model';
import { AssetRepository } from '../repositories/Asset.repository';
import { EditAssetDto } from '../dtos/EditAsset.dto';
import { events } from '@/common/events/events';

@Injectable()
export class EditAssetService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Edits an existing asset.
   */
  public async editAsset(
    assetId: number,
    dto: EditAssetDto,
    trx?: Knex.Transaction,
  ): Promise<Asset> {
    const asset = await this.assetRepository.findById(assetId);
    if (!asset) {
      throw new NotFoundException(`Asset with id ${assetId} not found`);
    }

    // Prevent editing disposed assets
    if (asset.status === 'disposed' || asset.status === 'sold') {
      throw new Error('Cannot edit a disposed or sold asset');
    }

    // Update the asset within transaction if provided
    const updateQuery = trx
      ? this.assetRepository.model.query(trx).patchAndFetchById(assetId, dto)
      : this.assetRepository.model.query().patchAndFetchById(assetId, dto);

    const updatedAsset = await updateQuery;

    // Emit event
    this.eventEmitter.emit(events.assets.onEdited, {
      asset: updatedAsset,
      trx,
    });

    return updatedAsset;
  }
}
