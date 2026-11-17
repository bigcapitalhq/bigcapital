import { Module } from '@nestjs/common';
import { RegisterTenancyModel } from '../../Tenancy/TenancyModels/Tenancy.module';
import { BatchAllocationsIntegrationModule } from '../../TransactionItemEntry/integrations/BatchAllocationsIntegration.module';
import { ItemEntryBatch } from '../../TransactionItemEntry/models/ItemEntryBatch';
import { BatchAllocationsService } from './BatchAllocations.service';
import { BatchAllocationsBridgeProvider } from './BatchAllocationsBridge.provider';

const models = [RegisterTenancyModel(ItemEntryBatch)];

/**
 * Standalone module for item entry batch allocations.
 *
 * Kept separate from `BatchesModule` to avoid a module cycle between the
 * inventory cost, sale invoices and batches modules.
 */
@Module({
  imports: [...models, BatchAllocationsIntegrationModule],
  providers: [BatchAllocationsService, BatchAllocationsBridgeProvider],
  exports: [...models, BatchAllocationsService],
})
export class BatchAllocationsModule {}
