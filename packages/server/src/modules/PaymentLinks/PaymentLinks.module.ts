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
import { TenancyModule } from '../Tenancy/Tenancy.module';

const models = [InjectSystemModel(PaymentLink)];

@Module({
  imports: [
    TenancyModule,
    forwardRef(() => StripePaymentModule),
    forwardRef(() => SaleInvoicesModule),
  ],
  providers: [
    ...models,
    CreateInvoiceCheckoutSession,
    GetPaymentLinkInvoicePdf,
    PaymentLinksApplication,
    GetInvoicePaymentLinkMetadata,
  ],
  controllers: [PaymentLinksController],
  exports: [...models, PaymentLinksApplication],
})
export class PaymentLinksModule {}
