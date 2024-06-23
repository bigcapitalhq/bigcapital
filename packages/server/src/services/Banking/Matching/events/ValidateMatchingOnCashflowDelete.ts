import { IManualJournalDeletingPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { ValidateTransactionMatched } from '../ValidateTransactionsMatched';
import { Inject, Service } from 'typedi';

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
      this.validateMatchingOnCashflowDelete.bind(this)
    );
  }

  /**
   *
   * @param {IManualJournalDeletingPayload}
   */
  public async validateMatchingOnCashflowDelete({
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
