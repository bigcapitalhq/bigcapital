import { Module } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { CreateWarehouse } from './commands/CreateWarehouse.service';
import { EditWarehouse } from './commands/EditWarehouse.service';
import { DeleteWarehouseService } from './commands/DeleteWarehouse.service';
import { WarehousesController } from './Warehouses.controller';
import { GetWarehouse } from './queries/GetWarehouse';
import { WarehouseMarkPrimary } from './commands/WarehouseMarkPrimary.service';
import { GetWarehouses } from './queries/GetWarehouses';
import { GetItemWarehouses } from './Items/GetItemWarehouses';
import { WarehouseValidator } from './commands/WarehouseValidator.service';
import { WarehousesApplication } from './WarehousesApplication.service';
import { ActivateWarehousesService } from './commands/ActivateWarehouses.service';
import { CreateInitialWarehouse } from './commands/CreateInitialWarehouse.service';
import { WarehousesSettings } from './WarehousesSettings';
import { WarehouseTransactionDTOTransform } from './Integrations/WarehouseTransactionDTOTransform';

@Module({
  imports: [TenancyDatabaseModule],
  controllers: [WarehousesController],
  providers: [
    CreateWarehouse,
    EditWarehouse,
    DeleteWarehouseService,
    GetWarehouse,
    GetWarehouses,
    GetItemWarehouses,
    WarehouseMarkPrimary,
    WarehouseValidator,
    WarehousesApplication,
    ActivateWarehousesService,
    CreateInitialWarehouse,
    WarehousesSettings,
    I18nContext,
    TenancyContext,
    TransformerInjectable,
    WarehouseTransactionDTOTransform,
  ],
  exports: [WarehouseTransactionDTOTransform],
})
export class WarehousesModule {}
