import { Module } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { CreateWarehouse } from './commands/CreateWarehouse.service';
import { EditWarehouse } from './commands/EditWarehouse.service';
import { DeleteWarehouseService } from './commands/DeleteWarehouse.service';
import { WarehousesController } from './Warehouses.controller';
import { WarehouseItemsController } from './WarehouseItems.controller';
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
import { BillsActivateWarehousesSubscriber } from './subscribers/Activate/BillWarehousesActivateSubscriber';
import { VendorCreditsActivateWarehousesSubscriber } from './subscribers/Activate/VendorCreditWarehousesActivateSubscriber';
import { ReceiptsActivateWarehousesSubscriber } from './subscribers/Activate/ReceiptWarehousesActivateSubscriber';
import { InvoicesActivateWarehousesSubscriber } from './subscribers/Activate/InvoiceWarehousesActivateSubscriber';
import { CreditsActivateWarehousesSubscriber } from './subscribers/Activate/CreditNoteWarehousesActivateSubscriber';
import { InventoryAdjustmentWarehouseValidatorSubscriber } from './subscribers/Validators/InventoryAdjustment/InventoryAdjustmentWarehouseValidatorSubscriber';
import { DeleteItemWarehousesQuantitySubscriber } from './subscribers/DeleteItemWarehousesQuantitySubscriber';
import { VendorCreditWarehousesValidateSubscriber } from './subscribers/Validators/Purchases/VendorCreditWarehousesSubscriber';
import { SaleInvoicesWarehousesValidateSubscriber } from './subscribers/Validators/Sales/SaleInvoicesWarehousesSubscriber';
import { SaleEstimateWarehousesValidateSubscriber } from './subscribers/Validators/Sales/SaleEstimateWarehousesSubscriber';
import { SaleReceiptWarehousesValidateSubscriber } from './subscribers/Validators/Sales/SaleReceiptWarehousesSubscriber';
import { CreditNoteWarehousesValidateSubscriber } from './subscribers/Validators/Sales/CreditNoteWarehousesSubscriber';
import { BillWarehousesValidateSubscriber } from './subscribers/Validators/Purchases/BillWarehousesSubscriber';
import { AccountsTransactionsWarehousesSubscribe } from './AccountsTransactionsWarehousesSubscribe';
import { BillActivateWarehouses } from './Activate/BillWarehousesActivate';
import { CreditNotesActivateWarehouses } from './Activate/CreditNoteWarehousesActivate';
import { VendorCreditActivateWarehouses } from './Activate/VendorCreditWarehousesActivate';
import { InvoicesActivateWarehouses } from './Activate/InvoiceWarehousesActivate';
import { ReceiptActivateWarehouses } from './Activate/ReceiptWarehousesActivate';
import { WarehousesDTOValidators } from './Integrations/WarehousesDTOValidators';
import { DeleteItemWarehousesQuantity } from './commands/DeleteItemWarehousesQuantity';
import { InventoryTransactionsWarehouses } from './AccountsTransactionsWarehouses';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { Warehouse } from './models/Warehouse.model';
import { ValidateWarehouseExistance } from './Integrations/ValidateWarehouseExistance';

const models = [RegisterTenancyModel(Warehouse)];

@Module({
  imports: [TenancyDatabaseModule, ...models],
  controllers: [WarehousesController, WarehouseItemsController],
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
    BillsActivateWarehousesSubscriber,
    CreditsActivateWarehousesSubscriber,
    InvoicesActivateWarehousesSubscriber,
    ReceiptsActivateWarehousesSubscriber,
    VendorCreditsActivateWarehousesSubscriber,
    InventoryAdjustmentWarehouseValidatorSubscriber,
    DeleteItemWarehousesQuantitySubscriber,
    BillWarehousesValidateSubscriber,
    CreditNoteWarehousesValidateSubscriber,
    SaleReceiptWarehousesValidateSubscriber,
    SaleEstimateWarehousesValidateSubscriber,
    SaleInvoicesWarehousesValidateSubscriber,
    VendorCreditWarehousesValidateSubscriber,
    AccountsTransactionsWarehousesSubscribe,
    BillActivateWarehouses,
    CreditNotesActivateWarehouses,
    VendorCreditActivateWarehouses,
    CreditNotesActivateWarehouses,
    InvoicesActivateWarehouses,
    ReceiptActivateWarehouses,
    WarehousesDTOValidators,
    DeleteItemWarehousesQuantity,
    InventoryTransactionsWarehouses,
    ValidateWarehouseExistance
  ],
  exports: [WarehousesSettings, WarehouseTransactionDTOTransform, WarehousesApplication, ...models],
})
export class WarehousesModule {}
