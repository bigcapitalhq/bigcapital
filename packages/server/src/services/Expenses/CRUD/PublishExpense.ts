import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import {
  ISystemUser,
  IExpensePublishingPayload,
  IExpenseEventPublishedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { CommandExpenseValidator } from './CommandExpenseValidator';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Inject()
export class PublishExpense {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private validator: CommandExpenseValidator;

  /**
   * Publish the given expense.
   * @param {number} tenantId
   * @param {number} expenseId
   * @param {ISystemUser} authorizedUser
   * @return {Promise<void>}
   */
  public async publishExpense(
    tenantId: number,
    expenseId: number,
    authorizedUser: ISystemUser
  ) {
    const { Expense } = this.tenancy.models(tenantId);

    // Retrieves the old expense or throw not found error.
    const oldExpense = await Expense.query()
      .findById(expenseId)
      .throwIfNotFound();

    // Validate the expense whether is published before.
    this.validator.validateExpenseIsNotPublished(oldExpense);

    // Publishes expense transactions with associated transactions
    // under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onExpensePublishing` event.
      await this.eventPublisher.emitAsync(events.expenses.onPublishing, {
        trx,
        oldExpense,
        tenantId,
      } as IExpensePublishingPayload);

      // Publish the given expense on the storage.
      await Expense.query().findById(expenseId).modify('publish');

      // Retrieve the new expense after modification.
      const expense = await Expense.query()
        .findById(expenseId)
        .withGraphFetched('categories');

      // Triggers `onExpensePublished` event.
      await this.eventPublisher.emitAsync(events.expenses.onPublished, {
        tenantId,
        expenseId,
        oldExpense,
        expense,
        authorizedUser,
        trx,
      } as IExpenseEventPublishedPayload);
    });
  }
}
