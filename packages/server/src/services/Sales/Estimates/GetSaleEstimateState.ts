import { Inject, Service } from 'typedi';
import { ISaleEstimateState } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class GetSaleEstimateState {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieves the create/edit sale estimate state.
   * @param {Number} saleEstimateId -
   * @return {Promise<ISaleEstimateState>}
   */
  public async getSaleEstimateState(
    tenantId: number
  ): Promise<ISaleEstimateState> {
    const { PdfTemplate } = this.tenancy.models(tenantId);

    const defaultPdfTemplate = await PdfTemplate.query()
      .findOne({ resource: 'SaleEstimate' })
      .modify('default');

    return {
      defaultTemplateId: defaultPdfTemplate?.id,
    };
  }
}
