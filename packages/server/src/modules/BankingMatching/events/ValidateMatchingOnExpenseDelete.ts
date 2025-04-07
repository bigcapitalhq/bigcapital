import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ValidateTransactionMatched } from '../commands/ValidateTransactionsMatched.service';
import { IExpenseEventDeletePayload } from '@/modules/Expenses/interfaces/Expenses.interface';
import { events } from '@/common/events/events';

@Injectable()
export class ValidateMatchingOnExpenseDeleteSubscriber {
  constructor(
    private readonly validateNoMatchingLinkedService: ValidateTransactionMatched,
  ) {}

  /**
   * Validates the expense transaction whether matched with bank transaction on deleting.
   * @param {IExpenseEventDeletePayload}
   */
  @OnEvent(events.expenses.onDeleting)
  public async validateMatchingOnExpenseDeleting({
    oldExpense,
    trx,
  }: IExpenseEventDeletePayload) {
    await this.validateNoMatchingLinkedService.validateTransactionNoMatchLinking(
      'Expense',
      oldExpense.id,
      trx,
    );
  }
}
