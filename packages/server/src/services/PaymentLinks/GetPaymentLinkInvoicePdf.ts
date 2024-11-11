import { Inject, Service } from 'typedi';
import { initalizeTenantServices } from '@/api/middleware/TenantDependencyInjection';
import { SaleInvoicePdf } from '../Sales/Invoices/SaleInvoicePdf';
import { PaymentLink } from '@/system/models';

@Service()
export class GetPaymentLinkInvoicePdf {
  @Inject()
  private getSaleInvoicePdfService: SaleInvoicePdf;

  /**
   * Retrieves the sale invoice PDF of the given payment link id.
   * @param {number} tenantId
   * @param {number} paymentLinkId
   * @returns {Promise<Buffer, string>}
   */
  async getPaymentLinkInvoicePdf(
    paymentLinkId: string
  ): Promise<[Buffer, string]> {
    const paymentLink = await PaymentLink.query()
      .findOne('linkId', paymentLinkId)
      .where('resourceType', 'SaleInvoice')
      .throwIfNotFound();

    const tenantId = paymentLink.tenantId;
    await initalizeTenantServices(tenantId);

    const saleInvoiceId = paymentLink.resourceId;

    return this.getSaleInvoicePdfService.saleInvoicePdf(
      tenantId,
      saleInvoiceId
    );
  }
}
