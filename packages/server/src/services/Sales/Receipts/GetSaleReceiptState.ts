import { Inject, Service } from 'typedi';
import { ISaleReceiptState } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class GetSaleReceiptState {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieves the sale receipt state.
   * @param {Number} tenantId -
   * @return {Promise<ISaleReceiptState>}
   */
  public async getSaleReceiptState(
    tenantId: number
  ): Promise<ISaleReceiptState> {
    const { PdfTemplate } = this.tenancy.models(tenantId);

    const defaultPdfTemplate = await PdfTemplate.query()
      .findOne({ resource: 'SaleReceipt' })
      .modify('default');

    return {
      defaultTemplateId: defaultPdfTemplate?.id,
    };
  }
}
