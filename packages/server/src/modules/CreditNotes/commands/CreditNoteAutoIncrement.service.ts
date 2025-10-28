import { AutoIncrementOrdersService } from '@/modules/AutoIncrementOrders/AutoIncrementOrders.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreditNoteAutoIncrementService {
  constructor(
    private readonly autoIncrementOrdersService: AutoIncrementOrdersService,
  ) {}

  /**
   * Retrieve the next unique credit number.
   * @return {string}
   */
  public getNextCreditNumber(): Promise<string> {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      'credit_note',
    );
  }

  /**
   * Increment the credit note serial next number.
   */
  public incrementSerialNumber() {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      'credit_note',
    );
  }
}
