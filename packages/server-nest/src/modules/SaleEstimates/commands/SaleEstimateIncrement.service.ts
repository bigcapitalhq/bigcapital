import { AutoIncrementOrdersService } from '@/modules/AutoIncrementOrders/AutoIncrementOrders.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SaleEstimateIncrement {
  constructor(
    private readonly autoIncrementOrdersService: AutoIncrementOrdersService,
  ) {}

  /**
   * Retrieve the next unique estimate number.
   * @return {string}
   */
  public getNextEstimateNumber(): string {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      'sales_estimates',
    );
  }

  /**
   * Increment the estimate next number.
   */
  public incrementNextEstimateNumber() {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      'sales_estimates',
    );
  }
}
