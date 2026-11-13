import { Module } from '@nestjs/common';
import { RegisterTenancyModel } from '../../Tenancy/TenancyModels/Tenancy.module';
import { Batch } from './models/Batch';
import { BatchesController } from './Batches.controller';
import { BatchDetailsReportController } from './BatchDetailsReport.controller';
import { BatchesApplication } from './BatchesApplication';
import { BatchesValidators } from './BatchesValidators.service';
import { BatchesBalanceService } from './BatchesBalance.service';
import { CreateBatchService } from './commands/CreateBatch.service';
import { EditBatchService } from './commands/EditBatch.service';
import { DeleteBatchService } from './commands/DeleteBatch.service';
import { GetBatchesService } from './queries/GetBatches.service';
import { BatchDetailsReportService } from './BatchDetailsReport.service';
import { BatchesSubscriber } from './BatchesSubscriber';
import { BatchesFeatureGuard } from './BatchesFeatureGuard';
import { FeaturesModule } from '../../Features/Features.module';
import { TenancyModule } from '../../Tenancy/Tenancy.module';
import { TenancyDatabaseModule } from '../../Tenancy/TenancyDB/TenancyDB.module';
import { InventoryCostModule } from '../../InventoryCost/InventoryCost.module';
import { BatchAllocationsModule } from './BatchAllocations.module';

const models = [RegisterTenancyModel(Batch)];

@Module({
  imports: [
    TenancyModule,
    TenancyDatabaseModule,
    FeaturesModule,
    InventoryCostModule,
    BatchAllocationsModule,
    ...models,
  ],
  providers: [
    BatchesApplication,
    BatchesValidators,
    BatchesBalanceService,
    CreateBatchService,
    EditBatchService,
    DeleteBatchService,
    GetBatchesService,
    BatchDetailsReportService,
    BatchesSubscriber,
    BatchesFeatureGuard,
  ],
  controllers: [BatchesController, BatchDetailsReportController],
  exports: [
    ...models,
    BatchesApplication,
    BatchesValidators,
    BatchesBalanceService,
  ],
})
export class BatchesModule {}
