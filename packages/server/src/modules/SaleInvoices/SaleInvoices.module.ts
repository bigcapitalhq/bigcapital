import { forwardRef, Module } from '@nestjs/common';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { CreateSaleInvoice } from './commands/CreateSaleInvoice.service';
import { DeleteSaleInvoice } from './commands/DeleteSaleInvoice.service';
import { DeliverSaleInvoice } from './commands/DeliverSaleInvoice.service';
import { EditSaleInvoice } from './commands/EditSaleInvoice.service';
import { GenerateShareLink } from './commands/GenerateInvoicePaymentLink.service';
import { SaleInvoiceIncrement } from './commands/SaleInvoiceIncrement.service';
import { GetInvoicePaymentMail } from './queries/GetInvoicePaymentMail.service';
import { GetSaleInvoice } from './queries/GetSaleInvoice.service';
import { GetSaleInvoicesPayable } from './queries/GetSaleInvoicesPayable.service';
import { GetSaleInvoiceState } from './queries/GetSaleInvoiceState.service';
import { SaleInvoicePdf } from './queries/SaleInvoicePdf.service';
import { SaleInvoiceApplication } from './SaleInvoices.application';
import { ItemsEntriesService } from '../Items/ItemsEntries.service';
import { CommandSaleInvoiceValidators } from './commands/CommandSaleInvoiceValidators.service';
import { CommandSaleInvoiceDTOTransformer } from './commands/CommandSaleInvoiceDTOTransformer.service';
import { SaleEstimateValidators } from '../SaleEstimates/commands/SaleEstimateValidators.service';
import { UnlinkConvertedSaleEstimate } from '../SaleEstimates/commands/UnlinkConvertedSaleEstimate.service';
import { PdfTemplatesModule } from '../PdfTemplate/PdfTemplates.module';
import { AutoIncrementOrdersModule } from '../AutoIncrementOrders/AutoIncrementOrders.module';
import { ChromiumlyTenancyModule } from '../ChromiumlyTenancy/ChromiumlyTenancy.module';
import { SaleInvoicePdfTemplate } from './queries/SaleInvoicePdfTemplate.service';
import { WriteoffSaleInvoice } from './commands/WriteoffSaleInvoice.service';
import { GetInvoicePaymentsService } from './queries/GetInvoicePayments.service';
import { BranchesModule } from '../Branches/Branches.module';
import { WarehousesModule } from '../Warehouses/Warehouses.module';
import { TaxRatesModule } from '../TaxRates/TaxRate.module';
import { SaleInvoicesController } from './SaleInvoices.controller';
import { InvoiceGLEntriesSubscriber } from './subscribers/InvoiceGLEntriesSubscriber';
import { SaleInvoiceGLEntries } from './ledger/InvoiceGLEntries';
import { LedgerModule } from '../Ledger/Ledger.module';
import { AccountsModule } from '../Accounts/Accounts.module';
import { SaleInvoiceWriteoffSubscriber } from './subscribers/SaleInvoiceWriteoffSubscriber';
import { SaleInvoiceWriteoffGLStorage } from './commands/writeoff/SaleInvoiceWriteoffGLStorage';
import { InvoiceInventoryTransactions } from './commands/inventory/InvoiceInventoryTransactions';
import { MailModule } from '../Mail/Mail.module';
import { GetSaleInvoicesService } from './queries/GetSaleInvoices';
import { SendSaleInvoiceMail } from './commands/SendSaleInvoiceMail';
import { GetSaleInvoiceMailState } from './queries/GetSaleInvoiceMailState.service';
import { InventoryCostModule } from '../InventoryCost/InventoryCost.module';
import { SendSaleInvoiceMailCommon } from './commands/SendInvoiceInvoiceMailCommon.service';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { MailNotificationModule } from '../MailNotification/MailNotification.module';
import { SendSaleInvoiceMailProcessor } from './processors/SendSaleInvoiceMail.processor';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullModule } from '@nestjs/bullmq';
import { SendSaleInvoiceQueue } from './constants';
import { InvoicePaymentIntegrationSubscriber } from './subscribers/InvoicePaymentIntegrationSubscriber';
import { InvoiceChangeStatusOnMailSentSubscriber } from './subscribers/InvoiceChangeStatusOnMailSentSubscriber';
import { InvoiceCostGLEntriesSubscriber } from './subscribers/InvoiceCostGLEntriesSubscriber';
import { InvoicePaymentGLRewriteSubscriber } from './subscribers/InvoicePaymentGLRewriteSubscriber';
import { SaleInvoiceWriteInventoryTransactionsSubscriber } from './subscribers/InvoiceWriteInventoryTransactions';
import { SaleInvoiceAutoIncrementSubscriber } from './subscribers/SaleInvoiceAutoIncrementSubscriber';
import { SaleInvoiceCostGLEntries } from './SaleInvoiceCostGLEntries';
import { InvoicePaymentsGLEntriesRewrite } from './InvoicePaymentsGLRewrite';
import { PaymentsReceivedModule } from '../PaymentReceived/PaymentsReceived.module';
import { SaleInvoicesCost } from './SalesInvoicesCost';
import { SaleInvoicesExportable } from './commands/SaleInvoicesExportable';
import { SaleInvoicesImportable } from './commands/SaleInvoicesImportable';
import { PaymentLinksModule } from '../PaymentLinks/PaymentLinks.module';
import { BulkDeleteSaleInvoicesService } from './BulkDeleteSaleInvoices.service';
import { ValidateBulkDeleteSaleInvoicesService } from './ValidateBulkDeleteSaleInvoices.service';

@Module({
  imports: [
    TenancyDatabaseModule,
    PdfTemplatesModule,
    AutoIncrementOrdersModule,
    ChromiumlyTenancyModule,
    BranchesModule,
    WarehousesModule,
    TaxRatesModule,
    PaymentsReceivedModule,
    LedgerModule,
    AccountsModule,
    MailModule,
    MailNotificationModule,
    forwardRef(() => InventoryCostModule),
    forwardRef(() => PaymentLinksModule),
    DynamicListModule,
    BullModule.registerQueue({ name: SendSaleInvoiceQueue }),
    BullBoardModule.forFeature({
      name: SendSaleInvoiceQueue,
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [SaleInvoicesController],
  providers: [
    CreateSaleInvoice,
    EditSaleInvoice,
    DeleteSaleInvoice,
    GetSaleInvoicesPayable,
    DeliverSaleInvoice,
    GenerateShareLink,
    GetInvoicePaymentMail,
    SaleInvoiceIncrement,
    GetSaleInvoiceState,
    GetSaleInvoice,
    GetInvoicePaymentMail,
    SaleInvoicePdf,
    SaleInvoiceApplication,
    TenancyContext,
    TransformerInjectable,
    ItemsEntriesService,
    CommandSaleInvoiceValidators,
    CommandSaleInvoiceDTOTransformer,
    SaleEstimateValidators,
    UnlinkConvertedSaleEstimate,
    SaleInvoicePdfTemplate,
    WriteoffSaleInvoice,
    GetInvoicePaymentsService,
    SaleInvoiceGLEntries,
    InvoiceGLEntriesSubscriber,
    SaleInvoiceWriteoffGLStorage,
    SaleInvoiceWriteoffSubscriber,
    InvoiceInventoryTransactions,
    SendSaleInvoiceMail,
    GetSaleInvoicesService,
    GetSaleInvoiceMailState,
    SendSaleInvoiceMailCommon,
    SendSaleInvoiceMailProcessor,
    SaleInvoiceCostGLEntries,
    InvoicePaymentIntegrationSubscriber,
    InvoiceChangeStatusOnMailSentSubscriber,
    InvoiceCostGLEntriesSubscriber,
    InvoicePaymentGLRewriteSubscriber,
    SaleInvoiceWriteInventoryTransactionsSubscriber,
    SaleInvoiceAutoIncrementSubscriber,
    InvoicePaymentsGLEntriesRewrite,
    SaleInvoicesCost,
    SaleInvoicesExportable,
    SaleInvoicesImportable,
    BulkDeleteSaleInvoicesService,
    ValidateBulkDeleteSaleInvoicesService,
  ],
  exports: [
    GetSaleInvoice,
    SaleInvoicesCost,
    SaleInvoicePdf,
    SaleInvoicesExportable,
    SaleInvoicesImportable,
  ],
})
export class SaleInvoicesModule {}
