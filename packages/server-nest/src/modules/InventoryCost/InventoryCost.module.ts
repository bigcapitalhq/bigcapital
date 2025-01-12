import { Module } from '@nestjs/common';
import { InventoryCostGLBeforeWriteSubscriber } from './subscribers/InventoryCostGLBeforeWriteSubscriber';
import { InventoryCostGLStorage } from './InventoryCostGLStorage.service';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { InventoryCostLotTracker } from './models/InventoryCostLotTracker';
import { InventoryTransaction } from './models/InventoryTransaction';

const models = [
  RegisterTenancyModel(InventoryCostLotTracker),
  RegisterTenancyModel(InventoryTransaction),
];

@Module({
  providers: [
    ...models,
    InventoryCostGLBeforeWriteSubscriber,
    InventoryCostGLStorage,
  ],
  exports: [...models],
})
export class InventoryCostModule {}
