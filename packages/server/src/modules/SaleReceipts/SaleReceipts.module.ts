import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SaleReceiptApplication } from './SaleReceiptApplication.service';
import { CreateSaleReceipt } from './commands/CreateSaleReceipt.service';
import { EditSaleReceipt } from './commands/EditSaleReceipt.service';
import { GetSaleReceipt } from './queries/GetSaleReceipt.service';
import { DeleteSaleReceipt } from './commands/DeleteSaleReceipt.service';
import { CloseSaleReceipt } from './commands/CloseSaleReceipt.service';
import { SaleReceiptsPdfService } from './queries/SaleReceiptsPdf.service';
import { GetSaleReceiptState } from './queries/GetSaleReceiptState.service';
import { ItemsModule } from '../Items/Items.module';
import { SaleReceiptDTOTransformer } from './commands/SaleReceiptDTOTransformer.service';
import { SaleReceiptValidators } from './commands/SaleReceiptValidators.service';
import { ChromiumlyTenancyModule } from '../ChromiumlyTenancy/ChromiumlyTenancy.module';
import { TemplateInjectableModule } from '../TemplateInjectable/TemplateInjectable.module';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { SaleReceiptBrandingTemplate } from './queries/SaleReceiptBrandingTemplate.service';
import { BranchesModule } from '../Branches/Branches.module';
import { WarehousesModule } from '../Warehouses/Warehouses.module';
import { SaleReceiptIncrement } from './commands/SaleReceiptIncrement.service';
import { PdfTemplatesModule } from '../PdfTemplate/PdfTemplates.module';
import { AutoIncrementOrdersModule } from '../AutoIncrementOrders/AutoIncrementOrders.module';
import { SaleReceiptsController } from './SaleReceipts.controller';
import { SaleReceiptGLEntriesSubscriber } from './subscribers/SaleReceiptGLEntriesSubscriber';
import { SaleReceiptGLEntries } from './ledger/SaleReceiptGLEntries';
import { LedgerModule } from '../Ledger/Ledger.module';
import { AccountsModule } from '../Accounts/Accounts.module';
import { SaleReceiptInventoryTransactionsSubscriber } from './inventory/SaleReceiptWriteInventoryTransactions';
import { GetSaleReceiptsService } from './queries/GetSaleReceipts.service';
import { SaleReceiptMailNotification } from './commands/SaleReceiptMailNotification';
import { SaleReceiptInventoryTransactions } from './inventory/SaleReceiptInventoryTransactions';
import { InventoryCostModule } from '../InventoryCost/InventoryCost.module';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { MailNotificationModule } from '../MailNotification/MailNotification.module';
import { SendSaleReceiptMailProcess } from './processes/SendSaleReceiptMail.process';
import { MailModule } from '../Mail/Mail.module';
import { SendSaleReceiptMailQueue } from './constants';
import { SaleReceiptsExportable } from './commands/SaleReceiptsExportable';
import { SaleReceiptsImportable } from './commands/SaleReceiptsImportable';
import { GetSaleReceiptMailStateService } from './queries/GetSaleReceiptMailState.service';
import { GetSaleReceiptMailTemplateService } from './queries/GetSaleReceiptMailTemplate.service';
import { SaleReceiptAutoIncrementSubscriber } from './subscribers/SaleReceiptAutoIncrementSubscriber';
import { BulkDeleteSaleReceiptsService } from './BulkDeleteSaleReceipts.service';
import { ValidateBulkDeleteSaleReceiptsService } from './ValidateBulkDeleteSaleReceipts.service';
import { TaxRatesModule } from '../TaxRates/TaxRate.module';

@Module({
  controllers: [SaleReceiptsController],
  imports: [
    ItemsModule,
    TaxRatesModule,
    ChromiumlyTenancyModule,
    TemplateInjectableModule,
    BranchesModule,
    WarehousesModule,
    PdfTemplatesModule,
    AutoIncrementOrdersModule,
    LedgerModule,
    AccountsModule,
    InventoryCostModule,
    DynamicListModule,
    MailModule,
    MailNotificationModule,
    BullModule.registerQueue({ name: SendSaleReceiptMailQueue }),
  ],
  providers: [
    TenancyContext,
    SaleReceiptValidators,
    SaleReceiptApplication,
    CreateSaleReceipt,
    EditSaleReceipt,
    GetSaleReceipt,
    DeleteSaleReceipt,
    CloseSaleReceipt,
    SaleReceiptsPdfService,
    GetSaleReceiptState,
    SaleReceiptDTOTransformer,
    SaleReceiptBrandingTemplate,
    SaleReceiptIncrement,
    SaleReceiptGLEntries,
    SaleReceiptGLEntriesSubscriber,
    GetSaleReceiptsService,
    SaleReceiptMailNotification,
    SaleReceiptInventoryTransactions,
    SaleReceiptInventoryTransactionsSubscriber,
    SendSaleReceiptMailProcess,
    SaleReceiptsExportable,
    SaleReceiptsImportable,
    GetSaleReceiptMailStateService,
    GetSaleReceiptMailTemplateService,
    SaleReceiptAutoIncrementSubscriber,
    BulkDeleteSaleReceiptsService,
    ValidateBulkDeleteSaleReceiptsService,
  ],
})
export class SaleReceiptsModule { }
