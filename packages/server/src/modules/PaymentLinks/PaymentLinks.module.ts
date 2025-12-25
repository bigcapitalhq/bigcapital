import { forwardRef, Module } from '@nestjs/common';
import { CreateInvoiceCheckoutSession } from './CreateInvoiceCheckoutSession';
import { GetPaymentLinkInvoicePdf } from './GetPaymentLinkInvoicePdf';
import { PaymentLinksApplication } from './PaymentLinksApplication';
import { PaymentLinksController } from './PaymentLinks.controller';
import { InjectSystemModel } from '../System/SystemModels/SystemModels.module';
import { PaymentLink } from './models/PaymentLink';
import { StripePaymentModule } from '../StripePayment/StripePayment.module';
import { SaleInvoicesModule } from '../SaleInvoices/SaleInvoices.module';
import { GetInvoicePaymentLinkMetadata } from './GetInvoicePaymentLinkMetadata';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { GenerateShareLink } from '../SaleInvoices/commands/GenerateInvoicePaymentLink.service';

const models = [InjectSystemModel(PaymentLink)];

@Module({
  imports: [
    forwardRef(() => StripePaymentModule),
    forwardRef(() => SaleInvoicesModule),
  ],
  providers: [
    ...models,
    TenancyContext,
    CreateInvoiceCheckoutSession,
    GenerateShareLink,
    GetPaymentLinkInvoicePdf,
    PaymentLinksApplication,
    GetInvoicePaymentLinkMetadata,
  ],
  controllers: [PaymentLinksController],
  exports: [...models, PaymentLinksApplication],
})
export class PaymentLinksModule {}
