import { Module } from '@nestjs/common';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { InventoryAdjustment } from './models/InventoryAdjustment';
import { InventoryAdjustmentEntry } from './models/InventoryAdjustmentEntry';
import { CreateQuickInventoryAdjustmentService } from './commands/CreateQuickInventoryAdjustment.service';
import { PublishInventoryAdjustmentService } from './commands/PublishInventoryAdjustment.service';
import { GetInventoryAdjustmentService } from './queries/GetInventoryAdjustment.service';
// import { GetInventoryAdjustmentsService } from './queries/GetInventoryAdjustments.service';
import { DeleteInventoryAdjustmentService } from './commands/DeleteInventoryAdjustment.service';
import { InventoryAdjustmentsApplicationService } from './InventoryAdjustmentsApplication.service';
import { InventoryAdjustmentsController } from './InventoryAdjustments.controller';
import { BranchesModule } from '../Branches/Branches.module';
import { WarehousesModule } from '../Warehouses/Warehouses.module';
import { InventoryAdjustmentsGLSubscriber } from './subscribers/InventoryAdjustmentGL.subscriber';

const models = [
  RegisterTenancyModel(InventoryAdjustment),
  RegisterTenancyModel(InventoryAdjustmentEntry),
];
@Module({
  imports: [BranchesModule, WarehousesModule],
  controllers: [InventoryAdjustmentsController],
  providers: [
    ...models,
    CreateQuickInventoryAdjustmentService,
    PublishInventoryAdjustmentService,
    // GetInventoryAdjustmentsService,
    GetInventoryAdjustmentService,
    DeleteInventoryAdjustmentService,
    InventoryAdjustmentsApplicationService,
    InventoryAdjustmentsGLSubscriber,
  ],
  exports: [...models],
})
export class InventoryAdjustmentsModule {}
