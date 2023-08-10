import { Inject, Service } from 'typedi';
import AutoIncrementOrdersService from '../AutoIncrementOrdersService';

@Service()
export class SaleEstimateIncrement {
  @Inject()
  private autoIncrementOrdersService: AutoIncrementOrdersService;

  /**
   * Retrieve the next unique estimate number.
   * @param  {number} tenantId - Tenant id.
   * @return {string}
   */
  public getNextEstimateNumber(tenantId: number): string {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      tenantId,
      'sales_estimates'
    );
  }

  /**
   * Increment the estimate next number.
   * @param {number} tenantId -
   */
  public incrementNextEstimateNumber(tenantId: number) {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      tenantId,
      'sales_estimates'
    );
  }
}
