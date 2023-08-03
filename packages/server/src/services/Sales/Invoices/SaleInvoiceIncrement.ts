import { Inject, Service } from 'typedi';
import AutoIncrementOrdersService from '../AutoIncrementOrdersService';

@Service()
export class SaleInvoiceIncrement {
  @Inject()
  private autoIncrementOrdersService: AutoIncrementOrdersService;

  /**
   * Retrieves the next unique invoice number.
   * @param {number} tenantId - Tenant id.
   * @return {string}
   */
  public getNextInvoiceNumber(tenantId: number): string {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      tenantId,
      'sales_invoices'
    );
  }

  /**
   * Increment the invoice next number.
   * @param {number} tenantId -
   */
  public incrementNextInvoiceNumber(tenantId: number) {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      tenantId,
      'sales_invoices'
    );
  }
}
