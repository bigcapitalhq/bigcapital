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
    // Publishes expense transactions with associated transactions
    // under unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Validates the publish operation against the locked expense row.
      const oldExpense = await this.validate(expenseId, trx);

      // Trigggers `onExpensePublishing` event.
      await this.eventPublisher.emitAsync(events.expenses.onPublishing, {
        trx,
        oldExpense,
      } as IExpensePublishingPayload);

      // Publish the given expense on the storage.
      await this.expenseModel()
        .query(trx)
        .findById(expenseId)
        .modify('publish');

      // Retrieve the new expense after modification.
      const expense = await this.expenseModel()
        .query(trx)
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

  /**
   * Validates the publish expense operation against the locked expense row:
   * existence and not already published.
   * @param {number} expenseId - Expense id.
   * @param {Knex.Transaction} trx - Locks the expense row (FOR UPDATE).
   * @returns {Promise<Expense>} The locked expense.
   */
  async validate(expenseId: number, trx: Knex.Transaction): Promise<Expense> {
    // Re-read the expense with a row lock to validate against current state.
    const oldExpense = await this.expenseModel()
      .query(trx)
      .findById(expenseId)
      .forUpdate()
      .throwIfNotFound();

    // Validate the expense whether is published before against the locked row.
    this.validator.validateExpenseIsNotPublished(oldExpense);
    return oldExpense;
  }
}
