import { Inject, Service } from 'typedi';
import { IManualJournalDeletingPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { ValidateTransactionMatched } from '../ValidateTransactionsMatched';

@Service()
export class ValidateMatchingOnManualJournalDelete {
  @Inject()
  private validateNoMatchingLinkedService: ValidateTransactionMatched;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.manualJournals.onDeleting,
      this.validateMatchingOnManualJournalDelete.bind(this)
    );
  }

  /**
   * 
   * @param {IManualJournalDeletingPayload}
   */
  public async validateMatchingOnManualJournalDelete({
    tenantId,
    oldManualJournal,
    trx,
  }: IManualJournalDeletingPayload) {
    await this.validateNoMatchingLinkedService.validateTransactionNoMatchLinking(
      tenantId,
      'ManualJournal',
      oldManualJournal.id
    );
  }
}
