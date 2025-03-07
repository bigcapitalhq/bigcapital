import { Injectable } from '@nestjs/common';
import { AutoIncrementOrdersService } from '@/modules/AutoIncrementOrders/AutoIncrementOrders.service';

@Injectable()
export class PaymentReceivedIncrement {
  /**
   * @param {AutoIncrementOrdersService} autoIncrementOrdersService - Auto increment orders service.
   */
  constructor(
    private readonly autoIncrementOrdersService: AutoIncrementOrdersService,
  ) {}

  /**
   * Retrieve the next unique payment receive number.
   * @return {Promise<string>}
   */
  public getNextPaymentReceiveNumber(): Promise<string> {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      'payment_receives',
    );
  }

  /**
   * Increment the payment receive next number.
   */
  public incrementNextPaymentReceiveNumber() {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      'payment_receives',
    );
  }
}
