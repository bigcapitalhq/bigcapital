import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  IExpensePublishingPayload,
  IExpenseEventPublishedPayload,
} from '../interfaces/Expenses.interface';
import { CommandExpenseValidator } from './CommandExpenseValidator.service';
import { Expense } from '../models/Expense.model';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class PublishExpense {
  /**
   * @param {EventEmitter2} eventPublisher - Event emitter.
   * @param {UnitOfWork} uow - Unit of work.
   * @param {CommandExpenseValidator} validator - Command expense validator.
   * @param {typeof Expense} expenseModel - Expense model.
   */
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly validator: CommandExpenseValidator,
    private readonly uow: UnitOfWork,

    @Inject(Expense.name)
    private readonly expenseModel: TenantModelProxy<typeof Expense>,
  ) {}

  /**
   * Publish the given expense.
   * @param {number} expenseId
   * @param {ISystemUser} authorizedUser
   * @return {Promise<void>}
   */
  public async publishExpense(expenseId: number) {
    // Retrieves the old expense or throw not found error.
    const oldExpense = await this.expenseModel()
      .query()
      .findById(expenseId)
      .throwIfNotFound();

    // Validate the expense whether is published before.
    this.validator.validateExpenseIsNotPublished(oldExpense);

    // Publishes expense transactions with associated transactions
    // under unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Trigggers `onExpensePublishing` event.
      await this.eventPublisher.emitAsync(events.expenses.onPublishing, {
        trx,
        oldExpense,
      } as IExpensePublishingPayload);

      // Publish the given expense on the storage.
      await this.expenseModel().query().findById(expenseId).modify('publish');

      // Retrieve the new expense after modification.
      const expense = await this.expenseModel()
        .query()
        .findById(expenseId)
        .withGraphFetched('categories');

      // Triggers `onExpensePublished` event.
      await this.eventPublisher.emitAsync(events.expenses.onPublished, {
        expenseId,
        oldExpense,
        expense,
        trx,
      } as IExpenseEventPublishedPayload);
    });
  }
}
