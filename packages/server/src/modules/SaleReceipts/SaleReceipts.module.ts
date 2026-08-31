import { Module } from '@nestjs/common';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullModule } from '@nestjs/bullmq';
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
import { TenancyModule } from '../Tenancy/Tenancy.module';
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
import { SMSModule } from '../SMS/SMS.module';
import { SaleReceiptSmsNotification } from './SaleReceiptSmsNotification';
import { SendSaleReceiptMailQueue } from './constants';
import { SMS_QUEUE } from '../SMS/SMS.constants';
import { SaleReceiptsExportable } from './commands/SaleReceiptsExportable';
import { SaleReceiptsImportable } from './commands/SaleReceiptsImportable';
import { GetSaleReceiptMailStateService } from './queries/GetSaleReceiptMailState.service';
import { GetSaleReceiptMailTemplateService } from './queries/GetSaleReceiptMailTemplate.service';
import { SaleReceiptAutoIncrementSubscriber } from './subscribers/SaleReceiptAutoIncrementSubscriber';
import { SaleReceiptSmsNotificationSubscriber } from './subscribers/SaleReceiptSmsNotificationSubscriber';
import { SaleReceiptCostGLEntriesSubscriber } from './subscribers/SaleReceiptCostGLEntriesSubscriber';
import { SaleReceiptCostGLEntries } from './SaleReceiptCostGLEntries';
import { BulkDeleteSaleReceiptsService } from './BulkDeleteSaleReceipts.service';
import { ValidateBulkDeleteSaleReceiptsService } from './ValidateBulkDeleteSaleReceipts.service';

@Module({
  controllers: [SaleReceiptsController],
  imports: [
    TenancyModule,
    ItemsModule,
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
    SMSModule,
    MailNotificationModule,
    BullModule.registerQueue({ name: SMS_QUEUE }),
    BullModule.registerQueue({ name: SendSaleReceiptMailQueue }),
    BullBoardModule.forFeature({
      name: SendSaleReceiptMailQueue,
      adapter: BullMQAdapter,
    }),
  ],
  providers: [
    SaleReceiptValidators,
    SaleReceiptApplication,
    SaleReceiptSmsNotification,
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
    SaleReceiptSmsNotificationSubscriber,
    SaleReceiptCostGLEntries,
    SaleReceiptCostGLEntriesSubscriber,
    BulkDeleteSaleReceiptsService,
    ValidateBulkDeleteSaleReceiptsService,
  ],
})
export class SaleReceiptsModule {}
