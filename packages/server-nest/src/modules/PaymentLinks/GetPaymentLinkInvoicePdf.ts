import { Inject, Injectable } from '@nestjs/common';
import { SaleInvoicePdf } from '../SaleInvoices/queries/SaleInvoicePdf.service';
import { PaymentLink } from './models/PaymentLink';

@Injectable()
export class GetPaymentLinkInvoicePdf {
  constructor(
    private readonly getSaleInvoicePdfService: SaleInvoicePdf,

    @Inject(PaymentLink.name)
    private readonly paymentLinkModel: typeof PaymentLink,
  ) {}

  /**
   * Retrieves the sale invoice PDF of the given payment link id.
   * @param {number} paymentLinkId
   * @returns {Promise<Buffer, string>}
   */
  async getPaymentLinkInvoicePdf(
    paymentLinkId: string,
  ): Promise<[Buffer, string]> {
    const paymentLink = await this.paymentLinkModel.query()
      .findOne('linkId', paymentLinkId)
      .where('resourceType', 'SaleInvoice')
      .throwIfNotFound();

    const tenantId = paymentLink.tenantId;
    await initalizeTenantServices(tenantId);

    const saleInvoiceId = paymentLink.resourceId;

    return this.getSaleInvoicePdfService.getSaleInvoicePdf(saleInvoiceId);
  }
}
