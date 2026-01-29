import { forwardRef, Module } from '@nestjs/common';
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
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullModule } from '@nestjs/bullmq';
import { InventoryAverageCostMethodService } from './commands/InventoryAverageCostMethod.service';
import { InventoryItemCostService } from './commands/InventoryCosts.service';
import { InventoryItemOpeningAvgCostService } from './commands/InventoryItemOpeningAvgCost.service';
import { InventoryCostSubscriber } from './subscribers/InventoryCost.subscriber';
import { SaleInvoicesModule } from '../SaleInvoices/SaleInvoices.module';
import { ImportModule } from '../Import/Import.module';
import { GetItemsInventoryValuationListService } from './queries/GetItemsInventoryValuationList.service';
import { InventoryCostController } from './InventoryCost.controller';

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
    BullBoardModule.forFeature({
      name: ComputeItemCostQueue,
      adapter: BullMQAdapter,
    }),
    BullBoardModule.forFeature({
      name: WriteInventoryTransactionsGLEntriesQueue,
      adapter: BullMQAdapter,
    }),
    forwardRef(() => SaleInvoicesModule),
    ImportModule,
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
    InventoryCostSubscriber,
    GetItemsInventoryValuationListService,
  ],
  exports: [
    ...models,
    InventoryTransactionsService,
    InventoryItemCostService,
    InventoryComputeCostService,
  ],
  controllers: [InventoryCostController],
})
export class InventoryCostModule {}
