import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { ValidateTransactionMatched } from '../commands/ValidateTransactionsMatched.service';
import { ICommandCashflowDeletingPayload } from '@/modules/BankingTransactions/types/BankingTransactions.types';

@Injectable()
export class ValidateMatchingOnCashflowDeleteSubscriber {
  constructor(
    private readonly validateNoMatchingLinkedService: ValidateTransactionMatched,
  ) {}

  /**
   * Validates the cashflow transaction whether matched with bank transaction on deleting.
   * @param {IManualJournalDeletingPayload}
   */
  @OnEvent(events.cashflow.onTransactionDeleting)
  public async validateMatchingOnCashflowDeleting({
    oldCashflowTransaction,
    trx,
  }: ICommandCashflowDeletingPayload) {
    await this.validateNoMatchingLinkedService.validateTransactionNoMatchLinking(
      'CashflowTransaction',
      oldCashflowTransaction.id,
      trx,
    );
  }
}
