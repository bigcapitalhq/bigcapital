import { Module } from '@nestjs/common';
import { InventoryCostGLStorage } from './InventoryCostGLStorage.service';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { InventoryCostLotTracker } from './models/InventoryCostLotTracker';
import { InventoryTransaction } from './models/InventoryTransaction';
import { InventoryCostGLBeforeWriteSubscriber } from './subscribers/InventoryCostGLBeforeWriteSubscriber';
import { InventoryItemsQuantitySyncService } from './InventoryItemsQuantitySync.service';
import { InventoryCostMethod } from './InventoryCostMethod';
import { InventoryTransactionsService } from './InventoryTransactions.service';
import { LedgerModule } from '../Ledger/Ledger.module';

const models = [
  RegisterTenancyModel(InventoryCostLotTracker),
  RegisterTenancyModel(InventoryTransaction),
];

@Module({
  imports: [LedgerModule],
  providers: [
    ...models,
    InventoryCostGLBeforeWriteSubscriber,
    InventoryCostGLStorage,
    InventoryItemsQuantitySyncService,
    InventoryCostMethod,
    InventoryTransactionsService
  ],
  exports: [...models],
})
export class InventoryCostModule {}
