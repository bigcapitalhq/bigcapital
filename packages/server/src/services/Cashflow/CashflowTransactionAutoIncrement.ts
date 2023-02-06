import { Service, Inject } from 'typedi';
import AutoIncrementOrdersService from '@/services/Sales/AutoIncrementOrdersService';

@Service()
export class CashflowTransactionAutoIncrement {
  @Inject()
  private autoIncrementOrdersService: AutoIncrementOrdersService;

  /**
   * Retrieve the next unique invoice number.
   * @param  {number} tenantId - Tenant id.
   * @return {string}
   */
  public getNextTransactionNumber = (tenantId: number): string => {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      tenantId,
      'cashflow'
    );
  };

  /**
   * Increment the invoice next number.
   * @param {number} tenantId -
   */
  public incrementNextTransactionNumber = (tenantId: number) => {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      tenantId,
      'cashflow'
    );
  };
}
