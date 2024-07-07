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
      this.validateMatchingOnManualJournalDeleting.bind(this)
    );
  }

  /**
   * Validates the manual journal transaction whether matched with bank transaction on deleting.
   * @param {IManualJournalDeletingPayload}
   */
  public async validateMatchingOnManualJournalDeleting({
    tenantId,
    oldManualJournal,
    trx,
  }: IManualJournalDeletingPayload) {
    await this.validateNoMatchingLinkedService.validateTransactionNoMatchLinking(
      tenantId,
      'ManualJournal',
      oldManualJournal.id,
      trx
    );
  }
}
