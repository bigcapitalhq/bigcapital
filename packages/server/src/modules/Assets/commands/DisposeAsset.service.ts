import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import { Asset } from '../models/Asset.model';
import { AssetRepository } from '../repositories/Asset.repository';
import { DisposeAssetDto } from '../dtos/DisposeAsset.dto';
import { events } from '@/common/events/events';

@Injectable()
export class DisposeAssetService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Disposes an asset (sale or disposal).
   */
  public async disposeAsset(
    assetId: number,
    dto: DisposeAssetDto,
    trx?: Knex.Transaction,
  ): Promise<Asset> {
    const asset = await this.assetRepository.findById(assetId);
    if (!asset) {
      throw new NotFoundException(`Asset with id ${assetId} not found`);
    }

    // Check if already disposed
    if (asset.status === 'disposed' || asset.status === 'sold') {
      throw new BadRequestException('Asset is already disposed or sold');
    }

    // Calculate gain/loss
    const netBookValue = asset.netBookValue;
    const disposalGainLoss = dto.disposalProceeds - netBookValue;

    const updateData = {
      status: dto.status,
      disposalDate: dto.disposalDate,
      disposalProceeds: dto.disposalProceeds,
      disposalGainLoss,
      disposalNotes: dto.disposalNotes,
      active: false,
    };

    // Update the asset within transaction if provided
    const updateQuery = trx
      ? this.assetRepository.model.query(trx).patchAndFetchById(assetId, updateData)
      : this.assetRepository.model.query().patchAndFetchById(assetId, updateData);

    const updatedAsset = await updateQuery;

    // Emit event
    this.eventEmitter.emit(events.assets.onDisposed, {
      asset: updatedAsset,
      netBookValue,
      disposalGainLoss,
      trx,
    });

    return updatedAsset;
  }
}
