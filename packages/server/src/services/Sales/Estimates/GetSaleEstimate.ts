import { ServiceError } from '@/exceptions';
import { Inject, Service } from 'typedi';
import { ERRORS } from '../constants';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class GetSaleEstimate {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieve the estimate details with associated entries.
   * @async
   * @param {number} tenantId - The tenant id.
   * @param {Integer} estimateId
   */
  public async getEstimate(tenantId: number, estimateId: number) {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    const estimate = await SaleEstimate.query()
      .findById(estimateId)
      .withGraphFetched('entries.item')
      .withGraphFetched('customer')
      .withGraphFetched('branch');

    if (!estimate) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_NOT_FOUND);
    }
    // Transformes sale estimate model to POJO.
    return this.transformer.transform(
      tenantId,
      estimate,
      new SaleEstimateTransformer()
    );
  }
}
