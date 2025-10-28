import { Injectable } from '@nestjs/common';
import { AutoIncrementOrdersService } from '../../AutoIncrementOrders/AutoIncrementOrders.service';

@Injectable()
export class SaleInvoiceIncrement {
  constructor(
    private readonly autoIncrementOrdersService: AutoIncrementOrdersService,
  ) {}

  /**
   * Retrieves the next unique invoice number.
   * @param {number} tenantId - Tenant id.
   * @return {Promise<string>}
   */
  public getNextInvoiceNumber(): Promise<string> {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      'sales_invoices',
    );
  }

  /**
   * Increment the invoice next number.
   * @param {number} tenantId -
   */
  public incrementNextInvoiceNumber() {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      'sales_invoices',
    );
  }
}
