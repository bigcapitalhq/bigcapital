import { Module } from '@nestjs/common';
import { CreateInvoiceCheckoutSession } from './CreateInvoiceCheckoutSession';
import { GetPaymentLinkInvoicePdf } from './GetPaymentLinkInvoicePdf';
import { PaymentLinksApplication } from './PaymentLinksApplication';
import { PaymentLinksController } from './PaymentLinks.controller';
import { InjectSystemModel } from '../System/SystemModels/SystemModels.module';
import { PaymentLink } from './models/PaymentLink';

const models = [InjectSystemModel(PaymentLink)];

@Module({
  providers: [
    ...models,
    CreateInvoiceCheckoutSession,
    GetPaymentLinkInvoicePdf,
    PaymentLinksApplication,
  ],
  controllers: [PaymentLinksController],
  exports: [...models, PaymentLinksApplication],
})
export class PaymentLinksModule {}
