import { Inject, Service } from 'typedi';
import AutoIncrementOrdersService from '../AutoIncrementOrdersService';

@Service()
export class PaymentReceivedIncrement {
  @Inject()
  private autoIncrementOrdersService: AutoIncrementOrdersService;

  /**
   * Retrieve the next unique payment receive number.
   * @param  {number} tenantId - Tenant id.
   * @return {string}
   */
  public getNextPaymentReceiveNumber(tenantId: number): string {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      tenantId,
      'payment_receives'
    );
  }

  /**
   * Increment the payment receive next number.
   * @param {number} tenantId
   */
  public incrementNextPaymentReceiveNumber(tenantId: number) {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      tenantId,
      'payment_receives'
    );
  }
}
