import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import { Asset } from '../models/Asset.model';
import { AssetRepository } from '../repositories/Asset.repository';
import { CreateAssetDto } from '../dtos/CreateAsset.dto';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { events } from '@/common/events/events';

@Injectable()
export class CreateAssetService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly tenancyContext: TenancyContext,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Creates a new asset.
   */
  public async createAsset(
    dto: CreateAssetDto,
    trx?: Knex.Transaction,
  ): Promise<Asset> {
    const user = await this.tenancyContext.getSystemUser();

    // Calculate initial book value
    const bookValue = dto.purchasePrice - (dto.openingDepreciation || 0);

    const assetData = {
      ...dto,
      userId: user.id,
      bookValue,
      currentDepreciation: 0,
      totalDepreciation: dto.openingDepreciation || 0,
      status: 'active' as const,
    };

    // Create the asset within transaction if provided
    const createQuery = trx
      ? this.assetRepository.model.query(trx).insert(assetData)
      : this.assetRepository.model.query().insert(assetData);

    const asset = await createQuery;

    // Emit event
    this.eventEmitter.emit(events.assets.onCreated, {
      asset,
      trx,
    });

    return asset;
  }
}
