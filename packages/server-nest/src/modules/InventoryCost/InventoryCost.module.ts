import { Module } from '@nestjs/common';
import { InventoryCostGLStorage } from './InventoryCostGLStorage.service';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { InventoryCostLotTracker } from './models/InventoryCostLotTracker';
import { InventoryTransaction } from './models/InventoryTransaction';
import { InventoryCostGLBeforeWriteSubscriber } from './subscribers/InventoryCostGLBeforeWriteSubscriber';
import { InventoryItemsQuantitySyncService } from './InventoryItemsQuantitySync.service';
import { InventoryCostMethod } from './InventoryCostMethod';

const models = [
  RegisterTenancyModel(InventoryCostLotTracker),
  RegisterTenancyModel(InventoryTransaction),
];

@Module({
  providers: [
    ...models,
    InventoryCostGLBeforeWriteSubscriber,
    InventoryCostGLStorage,
    InventoryItemsQuantitySyncService,
    InventoryCostMethod,
  ],
  exports: [...models],
})
export class InventoryCostModule {}
