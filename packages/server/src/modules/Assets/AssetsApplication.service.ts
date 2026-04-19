import { Injectable } from '@nestjs/common';
import { Asset } from './models/Asset.model';
import { AssetDepreciationEntry } from './models/AssetDepreciationEntry.model';
import { CreateAssetDto } from './dtos/CreateAsset.dto';
import { EditAssetDto } from './dtos/EditAsset.dto';
import { DisposeAssetDto } from './dtos/DisposeAsset.dto';
import { GetAssetsQueryDto } from './dtos/GetAssetsQuery.dto';
import { CreateAssetService } from './commands/CreateAsset.service';
import { EditAssetService } from './commands/EditAsset.service';
import { DeleteAssetService } from './commands/DeleteAsset.service';
import { DisposeAssetService } from './commands/DisposeAsset.service';
import { CalculateAssetDepreciationService } from './commands/CalculateAssetDepreciation.service';
import { GetAssetService } from './queries/GetAsset.service';
import { GetAssetsService } from './queries/GetAssets.service';
import { GetAssetDepreciationScheduleService } from './queries/GetAssetDepreciationSchedule.service';

@Injectable()
export class AssetsApplicationService {
  constructor(
    private readonly createAssetService: CreateAssetService,
    private readonly editAssetService: EditAssetService,
    private readonly deleteAssetService: DeleteAssetService,
    private readonly disposeAssetService: DisposeAssetService,
    private readonly calculateDepreciationService: CalculateAssetDepreciationService,
    private readonly getAssetService: GetAssetService,
    private readonly getAssetsService: GetAssetsService,
    private readonly getDepreciationScheduleService: GetAssetDepreciationScheduleService,
  ) {}

  /**
   * Creates a new asset.
   */
  public createAsset(dto: CreateAssetDto): Promise<Asset> {
    return this.createAssetService.createAsset(dto);
  }

  /**
   * Edits an existing asset.
   */
  public editAsset(assetId: number, dto: EditAssetDto): Promise<Asset> {
    return this.editAssetService.editAsset(assetId, dto);
  }

  /**
   * Deletes an asset.
   */
  public deleteAsset(assetId: number): Promise<void> {
    return this.deleteAssetService.deleteAsset(assetId);
  }

  /**
   * Bulk deletes assets.
   */
  public bulkDeleteAssets(assetIds: number[]): Promise<void> {
    return this.deleteAssetService.bulkDeleteAssets(assetIds);
  }

  /**
   * Disposes an asset.
   */
  public disposeAsset(assetId: number, dto: DisposeAssetDto): Promise<Asset> {
    return this.disposeAssetService.disposeAsset(assetId, dto);
  }

  /**
   * Gets a single asset.
   */
  public getAsset(assetId: number): Promise<Asset> {
    return this.getAssetService.getAsset(assetId);
  }

  /**
   * Gets paginated list of assets.
   */
  public getAssets(query: GetAssetsQueryDto): Promise<{ assets: Asset[]; filterMeta: any }> {
    return this.getAssetsService.getAssetsList(query);
  }

  /**
   * Calculates depreciation schedule for an asset.
   */
  public calculateDepreciation(assetId: number): Promise<void> {
    return this.calculateDepreciationService.calculateDepreciationSchedule(assetId);
  }

  /**
   * Gets depreciation schedule for an asset.
   */
  public getDepreciationSchedule(assetId: number): Promise<AssetDepreciationEntry[]> {
    return this.getDepreciationScheduleService.getDepreciationSchedule(assetId);
  }
}
