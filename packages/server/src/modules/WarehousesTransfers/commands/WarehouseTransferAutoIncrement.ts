import { AutoIncrementOrdersService } from '@/modules/AutoIncrementOrders/AutoIncrementOrders.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WarehouseTransferAutoIncrement {
  constructor(
    private readonly autoIncrementOrdersService: AutoIncrementOrdersService,
  ) {}

  /**
   * Retrieve the next unique invoice number.
   * @return {Promise<string>}
   */
  public getNextTransferNumber(): Promise<string> {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      'warehouse_transfers',
    );
  }

  /**
   * Increment the invoice next number.
   */
  public incrementNextTransferNumber() {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      'warehouse_transfers',
    );
  }
}
