import { Inject, Service } from 'typedi';
import AutoIncrementOrdersService from '../../Sales/AutoIncrementOrdersService';

@Service()
export class WarehouseTransferAutoIncrement {
  @Inject()
  private autoIncrementOrdersService: AutoIncrementOrdersService;

  /**
   * Retrieve the next unique invoice number.
   * @param  {number} tenantId - Tenant id.
   * @return {string}
   */
  public getNextTransferNumber(tenantId: number): string {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      tenantId,
      'warehouse_transfers'
    );
  }

  /**
   * Increment the invoice next number.
   * @param {number} tenantId -
   */
  public incrementNextTransferNumber(tenantId: number) {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      tenantId,
      'warehouse_transfers'
    );
  }
}
