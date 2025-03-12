import { Module } from '@nestjs/common';
import { InventoryCostGLStorage } from './commands/InventoryCostGLStorage.service';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { InventoryCostLotTracker } from './models/InventoryCostLotTracker';
import { InventoryTransaction } from './models/InventoryTransaction';
import { InventoryCostGLBeforeWriteSubscriber } from './subscribers/InventoryCostGLBeforeWriteSubscriber';
import { InventoryItemsQuantitySyncService } from './commands/InventoryItemsQuantitySync.service';
import { InventoryTransactionsService } from './commands/InventoryTransactions.service';
import { LedgerModule } from '../Ledger/Ledger.module';
import { InventoryComputeCostService } from './commands/InventoryComputeCost.service';
import { InventoryCostApplication } from './InventoryCostApplication';
import { StoreInventoryLotsCostService } from './commands/StoreInventortyLotsCost.service';
import { ComputeItemCostProcessor } from './processors/ComputeItemCost.processor';
import { WriteInventoryTransactionsGLEntriesProcessor } from './processors/WriteInventoryTransactionsGLEntries.processor';
import {
  ComputeItemCostQueue,
  WriteInventoryTransactionsGLEntriesQueue,
} from './types/InventoryCost.types';
import { BullModule } from '@nestjs/bullmq';
import { InventoryAverageCostMethodService } from './commands/InventoryAverageCostMethod.service';
import { InventoryItemCostService } from './commands/InventoryCosts.service';
import { InventoryItemOpeningAvgCostService } from './commands/InventoryItemOpeningAvgCost.service';

const models = [
  RegisterTenancyModel(InventoryCostLotTracker),
  RegisterTenancyModel(InventoryTransaction),
];

@Module({
  imports: [
    LedgerModule,
    ...models,
    BullModule.registerQueue({ name: ComputeItemCostQueue }),
    BullModule.registerQueue({
      name: WriteInventoryTransactionsGLEntriesQueue,
    }),
  ],
  providers: [
    InventoryCostGLBeforeWriteSubscriber,
    InventoryCostGLStorage,
    InventoryItemsQuantitySyncService,
    InventoryTransactionsService,
    InventoryComputeCostService,
    InventoryCostApplication,
    StoreInventoryLotsCostService,
    ComputeItemCostProcessor,
    WriteInventoryTransactionsGLEntriesProcessor,
    InventoryAverageCostMethodService,
    InventoryItemCostService,
    InventoryItemOpeningAvgCostService,
  ],
  exports: [...models, InventoryTransactionsService, InventoryItemCostService],
})
export class InventoryCostModule {}
