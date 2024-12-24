import { Injectable } from '@nestjs/common';
import { AutoIncrementOrdersService } from '@/modules/AutoIncrementOrders/AutoIncrementOrders.service';

@Injectable()
export class SaleReceiptIncrement {
  constructor(
    private readonly autoIncrementOrdersService: AutoIncrementOrdersService,
  ) {}

  /**
   * Retrieve the next unique receipt number.
   * @param  {number} tenantId - Tenant id.
   * @return {string}
   */
  public getNextReceiptNumber(): string {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      'sales_receipts',
    );
  }

  /**
   * Increment the receipt next number.
   * @param {number} tenantId -
   */
  public incrementNextReceiptNumber() {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      'sales_receipts',
    );
  }
}
