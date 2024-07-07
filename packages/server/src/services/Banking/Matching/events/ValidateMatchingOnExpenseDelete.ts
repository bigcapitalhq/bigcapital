import { Inject, Service } from 'typedi';
import { IExpenseEventDeletePayload } from '@/interfaces';
import events from '@/subscribers/events';
import { ValidateTransactionMatched } from '../ValidateTransactionsMatched';

@Service()
export class ValidateMatchingOnExpenseDelete {
  @Inject()
  private validateNoMatchingLinkedService: ValidateTransactionMatched;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.expenses.onDeleting,
      this.validateMatchingOnExpenseDeleting.bind(this)
    );
  }

  /**
   * Validates the expense transaction whether matched with bank transaction on deleting.
   * @param {IExpenseEventDeletePayload}
   */
  public async validateMatchingOnExpenseDeleting({
    tenantId,
    oldExpense,
    trx,
  }: IExpenseEventDeletePayload) {
    await this.validateNoMatchingLinkedService.validateTransactionNoMatchLinking(
      tenantId,
      'Expense',
      oldExpense.id,
      trx
    );
  }
}
