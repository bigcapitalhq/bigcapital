import { Module } from '@nestjs/common';
import { TenancyDatabaseModule } from '@/modules/Tenancy/TenancyDB/TenancyDB.module';
import { AssetsController } from './Assets.controller';
import { AssetsApplicationService } from './AssetsApplication.service';
import { AssetRepository } from './repositories/Asset.repository';
import { AssetDepreciationEntryRepository } from './repositories/AssetDepreciationEntry.repository';
import { CreateAssetService } from './commands/CreateAsset.service';
import { EditAssetService } from './commands/EditAsset.service';
import { DeleteAssetService } from './commands/DeleteAsset.service';
import { DisposeAssetService } from './commands/DisposeAsset.service';
import { CalculateAssetDepreciationService } from './commands/CalculateAssetDepreciation.service';
import { GetAssetService } from './queries/GetAsset.service';
import { GetAssetsService } from './queries/GetAssets.service';
import { GetAssetDepreciationScheduleService } from './queries/GetAssetDepreciationSchedule.service';
import { Asset } from './models/Asset.model';
import { AssetDepreciationEntry } from './models/AssetDepreciationEntry.model';
import { RegisterTenancyModel } from '@/modules/Tenancy/TenancyModels/TenancyModels.registry';

const models = RegisterTenancyModel([Asset, AssetDepreciationEntry]);

@Module({
  imports: [TenancyDatabaseModule, ...models],
  controllers: [AssetsController],
  providers: [
    AssetsApplicationService,
    AssetRepository,
    AssetDepreciationEntryRepository,
    CreateAssetService,
    EditAssetService,
    DeleteAssetService,
    DisposeAssetService,
    CalculateAssetDepreciationService,
    GetAssetService,
    GetAssetsService,
    GetAssetDepreciationScheduleService,
  ],
  exports: [
    AssetsApplicationService,
    AssetRepository,
    AssetDepreciationEntryRepository,
  ],
})
export class AssetsModule {}
