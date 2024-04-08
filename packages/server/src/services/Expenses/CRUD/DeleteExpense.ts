import { IExpenseDeletingPayload, IExpenseEventDeletePayload, ISystemUser } from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { CommandExpenseValidator } from './CommandExpenseValidator';

@Service()
export class DeleteExpense {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private validator: CommandExpenseValidator;

  /**
   * Deletes the given expense.
   * @param {number} tenantId
   * @param {number} expenseId
   * @param {ISystemUser} authorizedUser
   */
  public deleteExpense = async (tenantId: number, expenseId: number, authorizedUser: ISystemUser): Promise<void> => {
    const { Expense, ExpenseCategory } = this.tenancy.models(tenantId);

    // Retrieves the expense transaction with associated entries or
    // throw not found error.
    const oldExpense = await Expense.query().findById(expenseId).withGraphFetched('categories').throwIfNotFound();

    // Validates the expense has no associated landed cost.
    await this.validator.validateNoAssociatedLandedCost(tenantId, expenseId);

    // Deletes expense transactions with associated transactions under
    // unit-of-work envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onExpenseDeleting` event.
      await this.eventPublisher.emitAsync(events.expenses.onDeleting, {
        trx,
        tenantId,
        oldExpense,
      } as IExpenseDeletingPayload);

      // Deletes expense associated entries.
      await ExpenseCategory.query(trx).where('expenseId', expenseId).delete();

      // Deletes expense transactions.
      await Expense.query(trx).findById(expenseId).delete();

      // Triggers `onExpenseDeleted` event.
      await this.eventPublisher.emitAsync(events.expenses.onDeleted, {
        tenantId,
        expenseId,
        authorizedUser,
        oldExpense,
        trx,
      } as IExpenseEventDeletePayload);
    });
  };
}
