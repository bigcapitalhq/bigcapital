import { Module } from '@nestjs/common';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { InventoryAdjustment } from './models/InventoryAdjustment';
import { InventoryAdjustmentEntry } from './models/InventoryAdjustmentEntry';
import { CreateQuickInventoryAdjustmentService } from './commands/CreateQuickInventoryAdjustment.service';
import { PublishInventoryAdjustmentService } from './commands/PublishInventoryAdjustment.service';
import { GetInventoryAdjustmentService } from './queries/GetInventoryAdjustment.service';
import { GetInventoryAdjustmentsService } from './queries/GetInventoryAdjustments.service';
import { DeleteInventoryAdjustmentService } from './commands/DeleteInventoryAdjustment.service';
import { InventoryAdjustmentsApplicationService } from './InventoryAdjustmentsApplication.service';
import { InventoryAdjustmentsController } from './InventoryAdjustments.controller';

const models = [
  RegisterTenancyModel(InventoryAdjustment),
  RegisterTenancyModel(InventoryAdjustmentEntry),
];
@Module({
  controllers: [InventoryAdjustmentsController],
  providers: [
    ...models,
    CreateQuickInventoryAdjustmentService,
    PublishInventoryAdjustmentService,
    GetInventoryAdjustmentsService,
    GetInventoryAdjustmentService,
    DeleteInventoryAdjustmentService,
    InventoryAdjustmentsApplicationService,
  ],
  exports: [...models],
})
export class InventoryAdjustmentsModule {}
