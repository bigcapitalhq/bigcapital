import { Inject, Service } from 'typedi';
import { ICommandCashflowDeletingPayload, IManualJournalDeletingPayload } from '@/interfaces';
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
    oldCashflowTransaction,
    trx,
  }: ICommandCashflowDeletingPayload) {
    await this.validateNoMatchingLinkedService.validateTransactionNoMatchLinking(
      tenantId,
      'CashflowTransaction',
      oldCashflowTransaction.id,
      trx
    );
  }
}
