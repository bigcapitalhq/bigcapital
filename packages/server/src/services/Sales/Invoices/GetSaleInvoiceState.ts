import { Inject, Service } from 'typedi';
import { ISaleInvocieState } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class GetSaleInvoiceState {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieves the create/edit invoice state.
   * @param {Number} saleInvoiceId -
   * @return {Promise<ISaleInvoice>}
   */
  public async getSaleInvoiceState(
    tenantId: number
  ): Promise<ISaleInvocieState> {
    const { PdfTemplate } = this.tenancy.models(tenantId);

    const defaultPdfTemplate = await PdfTemplate.query()
      .findOne({ resource: 'SaleInvoice' })
      .modify('default');

    return {
      defaultTemplateId: defaultPdfTemplate?.id,
    };
  }
}
