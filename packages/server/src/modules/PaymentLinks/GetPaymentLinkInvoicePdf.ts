import { Inject, Injectable } from '@nestjs/common';
import { SaleInvoicePdf } from '../SaleInvoices/queries/SaleInvoicePdf.service';
import { PaymentLink } from './models/PaymentLink';
import { ClsService } from 'nestjs-cls';
import { TenantModel } from '../System/models/TenantModel';

@Injectable()
export class GetPaymentLinkInvoicePdf {
  constructor(
    private readonly getSaleInvoicePdfService: SaleInvoicePdf,
    private readonly clsService: ClsService,

    @Inject(PaymentLink.name)
    private readonly paymentLinkModel: typeof PaymentLink,

    @Inject(TenantModel.name)
    private readonly systemTenantModel: typeof TenantModel,
  ) {}

  /**
   * Retrieves the sale invoice PDF of the given payment link id.
   * @param {number} paymentLinkId
   * @returns {Promise<Buffer, string>}
   */
  async getPaymentLinkInvoicePdf(
    paymentLinkId: string,
  ): Promise<[Buffer, string]> {
    const paymentLink = await this.paymentLinkModel
      .query()
      .findOne('linkId', paymentLinkId)
      .where('resourceType', 'SaleInvoice')
      .throwIfNotFound();

    const saleInvoiceId = paymentLink.resourceId;
    const tenant = await this.systemTenantModel
      .query()
      .findById(paymentLink.tenantId);

    this.clsService.set('organizationId', tenant.organizationId);

    return this.getSaleInvoicePdfService.getSaleInvoicePdf(saleInvoiceId);
  }
}
