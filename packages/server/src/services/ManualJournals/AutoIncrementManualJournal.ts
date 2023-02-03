import { Inject, Service } from 'typedi';
import AutoIncrementOrdersService from '@/services/Sales/AutoIncrementOrdersService';

@Service()
export class AutoIncrementManualJournal {
  @Inject()
  private autoIncrementOrdersService: AutoIncrementOrdersService;

  public autoIncrementEnabled = (tenantId: number) => {
    return this.autoIncrementOrdersService.autoIncrementEnabled(
      tenantId,
      'manual_journals'
    );
  };

  /**
   * Retrieve the next journal number.
   */
  public getNextJournalNumber = (tenantId: number): string => {
    return this.autoIncrementOrdersService.getNextTransactionNumber(
      tenantId,
      'manual_journals'
    );
  };

  /**
   * Increment the manual journal number.
   * @param {number} tenantId
   */
  public incrementNextJournalNumber = (tenantId: number) => {
    return this.autoIncrementOrdersService.incrementSettingsNextNumber(
      tenantId,
      'manual_journals'
    );
  };
}
