import { Module } from '@nestjs/common';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { CreateSaleInvoice } from './commands/CreateSaleInvoice.service';
import { DeleteSaleInvoice } from './commands/DeleteSaleInvoice.service';
import { DeliverSaleInvoice } from './commands/DeliverSaleInvoice.service';
import { EditSaleInvoice } from './commands/EditSaleInvoice.service';
import { GenerateShareLink } from './commands/GenerateInvoicePaymentLink.service';
import { SaleInvoiceIncrement } from './commands/SaleInvoiceIncrement.service';
// import { SendSaleInvoiceMail } from './commands/SendSaleInvoiceMail';
// import { SendSaleInvoiceReminderMailJob } from './commands/SendSaleInvoiceMailReminderJob';
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

@Module({
  imports: [
    TenancyDatabaseModule,
    PdfTemplatesModule,
    AutoIncrementOrdersModule,
    ChromiumlyTenancyModule,
    BranchesModule,
    WarehousesModule,
    TaxRatesModule,
  ],
  controllers: [SaleInvoicesController],
  providers: [
    CreateSaleInvoice,
    EditSaleInvoice,
    DeleteSaleInvoice,
    GetSaleInvoicesPayable,
    DeliverSaleInvoice,
    // SendSaleInvoiceMail,
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
  ],
})
export class SaleInvoicesModule {}
