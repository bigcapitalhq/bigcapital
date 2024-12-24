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

@Module({
  imports: [TenancyDatabaseModule],
  controllers: [],
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
  ],
})
export class SaleInvoicesModule {}
