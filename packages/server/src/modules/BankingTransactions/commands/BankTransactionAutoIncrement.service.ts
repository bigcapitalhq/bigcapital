import { Injectable } from '@nestjs/common';
import { AutoIncrementOrdersService } from '../../AutoIncrementOrders/AutoIncrementOrders.service';

@Injectable()
export class BankTransactionAutoIncrement {
  constructor(
    private readonly autoIncrementOrdersService: AutoIncrementOrdersService,
  ) {}

  /**
   * Retrieve the next unique invoice number.
   * @return {string}
   */
  public getNextTransactionNumber = (): Promise<string> => {
    return this.autoIncrementOrdersService.getNextTransactionNumber('cashflow');
  };

  /**
   * Increment the invoice next number.
   */
  public incrementNextTransactionNumber = () => {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      'cashflow',
    );
  };
}
