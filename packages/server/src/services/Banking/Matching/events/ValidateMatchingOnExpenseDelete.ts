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
      this.validateMatchingOnExpenseDelete.bind(this)
    );
  }

  /**
   *
   * @param {IExpenseEventDeletePayload}
   */
  public async validateMatchingOnExpenseDelete({
    tenantId,
    oldExpense,
    trx,
  }: IExpenseEventDeletePayload) {
    await this.validateNoMatchingLinkedService.validateTransactionNoMatchLinking(
      tenantId,
      'Expense',
      oldExpense.id
    );
  }
}
