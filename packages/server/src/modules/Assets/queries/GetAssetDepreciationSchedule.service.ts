import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetDepreciationEntry } from '../models/AssetDepreciationEntry.model';
import { AssetRepository } from '../repositories/Asset.repository';
import { AssetDepreciationEntryRepository } from '../repositories/AssetDepreciationEntry.repository';

@Injectable()
export class GetAssetDepreciationScheduleService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly depreciationEntryRepository: AssetDepreciationEntryRepository,
  ) {}

  /**
   * Get depreciation schedule for an asset.
   */
  public async getDepreciationSchedule(assetId: number): Promise<AssetDepreciationEntry[]> {
    const asset = await this.assetRepository.findById(assetId);
    if (!asset) {
      throw new NotFoundException(`Asset with id ${assetId} not found`);
    }

    const entries = await this.depreciationEntryRepository.findByAssetId(assetId);
    return entries;
  }
}
