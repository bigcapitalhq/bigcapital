import { Inject, Service } from 'typedi';
import PdfService from '@/services/PDF/PdfService';
import { templateRender } from 'utils';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Tenant } from '@/system/models';

@Service()
export default class SaleReceiptsPdf {
  @Inject()
  pdfService: PdfService;

  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retrieve sale invoice pdf content.
   * @param {} saleInvoice -
   */
  async saleReceiptPdf(tenantId: number, saleReceipt) {
    const i18n = this.tenancy.i18n(tenantId);

    const organization = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    const htmlContent = templateRender('modules/receipt-regular', {
      saleReceipt,
      organizationName: organization.metadata.name,
      organizationEmail: organization.metadata.email,
      ...i18n,
    });
    const pdfContent = await this.pdfService.pdfDocument(htmlContent);

    return pdfContent;
  }
}
