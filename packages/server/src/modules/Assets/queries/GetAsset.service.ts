import { Injectable, NotFoundException } from '@nestjs/common';
import { Asset } from '../models/Asset.model';
import { AssetRepository } from '../repositories/Asset.repository';

@Injectable()
export class GetAssetService {
  constructor(
    private readonly assetRepository: AssetRepository,
  ) {}

  /**
   * Get a single asset by ID.
   */
  public async getAsset(assetId: number): Promise<Asset> {
    const asset = await this.assetRepository.findById(assetId);
    if (!asset) {
      throw new NotFoundException(`Asset with id ${assetId} not found`);
    }
    return asset;
  }
}
