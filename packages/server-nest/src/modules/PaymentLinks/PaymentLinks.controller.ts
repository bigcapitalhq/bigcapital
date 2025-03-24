import { Response } from 'express';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { PaymentLinksApplication } from './PaymentLinksApplication';

@Controller('payment-links')
export class PaymentLinksController {
  constructor(private readonly paymentLinkApp: PaymentLinksApplication) {}

  @Get('/:paymentLinkId/invoice')
  public async getPaymentLinkPublicMeta(
    @Param('paymentLinkId') paymentLinkId: string,
  ) {
    const data = await this.paymentLinkApp.getInvoicePaymentLink(paymentLinkId);

    return { data };
  }

  @Get('/:paymentLinkId/stripe_checkout_session')
  public async createInvoicePaymentLinkCheckoutSession(
    @Param('paymentLinkId') paymentLinkId: string,
  ) {
    const session =
      await this.paymentLinkApp.createInvoicePaymentCheckoutSession(
        paymentLinkId,
      );
    return session;
  }

  @Get('/:paymentLinkId/invoice/pdf')
  public async getPaymentLinkInvoicePdf(
    @Param('paymentLinkId') paymentLinkId: string,
    @Res() res: Response,
  ) {
    const [pdfContent, filename] =
      await this.paymentLinkApp.getPaymentLinkInvoicePdf(paymentLinkId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfContent.length,
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    res.send(pdfContent);
  }
}
