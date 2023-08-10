import { Inject, Service } from 'typedi';
import AutoIncrementOrdersService from '../AutoIncrementOrdersService';

@Service()
export class SaleReceiptIncrement {
  @Inject()
  private autoIncrementOrdersService: AutoIncrementOrdersService;

  /**
   * Retrieve the next unique receipt number.
   * @param  {number} tenantId - Tenant id.
   * @return {string}
   */
  public getNextReceiptNumber(tenantId: number): string {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      tenantId,
      'sales_receipts'
    );
  }

  /**
   * Increment the receipt next number.
   * @param {number} tenantId -
   */
  public incrementNextReceiptNumber(tenantId: number) {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      tenantId,
      'sales_receipts'
    );
  }
}
