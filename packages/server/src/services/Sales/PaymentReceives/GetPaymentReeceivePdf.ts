import { Inject, Service } from 'typedi';
import PdfService from '@/services/PDF/PdfService';
import { templateRender } from 'utils';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Tenant } from '@/system/models';

@Service()
export default class GetPaymentReceivePdf {
  @Inject()
  pdfService: PdfService;

  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retrieve sale invoice pdf content.
   * @param {} saleInvoice -
   */
  async getPaymentReceivePdf(tenantId: number, paymentReceive) {
    const i18n = this.tenancy.i18n(tenantId);

    const organization = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    const htmlContent = templateRender('modules/payment-receive-standard', {
      organization,
      organizationName: organization.metadata.name,
      organizationEmail: organization.metadata.email,
      paymentReceive,
      ...i18n,
    });
    const pdfContent = await this.pdfService.pdfDocument(htmlContent);

    return pdfContent;
  }
}
