import { Injectable } from '@nestjs/common';
import { AutoIncrementOrdersService } from '@/modules/AutoIncrementOrders/AutoIncrementOrders.service';

@Injectable()
export class AutoIncrementManualJournal {
  /**
   * 
   * @param autoIncrementOrdersService 
   */
  constructor(
    private readonly autoIncrementOrdersService: AutoIncrementOrdersService
  ) {}

  /**
   * 
   * @returns {boolean}
   */
  public autoIncrementEnabled = () => {
    return this.autoIncrementOrdersService.autoIncrementEnabled(
      'manual_journals'
    );
  };

  /**
   * Retrieve the next journal number.
   */
  public getNextJournalNumber = (): string => {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      'manual_journals'
    );
  };

  /**
   * Increment the manual journal number.
   * @param {number} tenantId
   */
  public incrementNextJournalNumber = () => {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      'manual_journals'
    );
  };
}
