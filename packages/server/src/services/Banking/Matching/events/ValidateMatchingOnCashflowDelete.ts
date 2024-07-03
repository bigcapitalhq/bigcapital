import { Inject, Service } from 'typedi';
import { IManualJournalDeletingPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { ValidateTransactionMatched } from '../ValidateTransactionsMatched';

@Service()
export class ValidateMatchingOnCashflowDelete {
  @Inject()
  private validateNoMatchingLinkedService: ValidateTransactionMatched;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.cashflow.onTransactionDeleting,
      this.validateMatchingOnCashflowDeleting.bind(this)
    );
  }

  /**
   * Validates the cashflow transaction whether matched with bank transaction on deleting.
   * @param {IManualJournalDeletingPayload}
   */
  public async validateMatchingOnCashflowDeleting({
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
