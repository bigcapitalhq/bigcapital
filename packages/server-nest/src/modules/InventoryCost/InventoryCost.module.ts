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

const models = [
  RegisterTenancyModel(InventoryCostLotTracker),
  RegisterTenancyModel(InventoryTransaction),
];

@Module({
  imports: [LedgerModule, ...models],
  providers: [
    InventoryCostGLBeforeWriteSubscriber,
    InventoryCostGLStorage,
    InventoryItemsQuantitySyncService,
    InventoryTransactionsService,
    InventoryComputeCostService,
  ],
  exports: [...models, InventoryTransactionsService],
})
export class InventoryCostModule {}
