import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { CommandExpenseValidator } from './CommandExpenseValidator.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { Expense } from '../models/Expense.model';
import { ExpenseCategory } from '../models/ExpenseCategory.model';
import { events } from '@/common/events/events';
import {
  IExpenseEventDeletePayload,
  IExpenseDeletingPayload,
} from '../interfaces/Expenses.interface';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DeleteExpense {
  /**
   * @param {EventEmitter2} eventEmitter - Event emitter.
   * @param {UnitOfWork} uow - Unit of work.
   * @param {CommandExpenseValidator} validator - Command expense validator.
   * @param {TenantModelProxy<typeof Expense>} expenseModel - Expense model.
   * @param {TenantModelProxy<typeof ExpenseCategory>} expenseCategoryModel - Expense category model.
   */
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly validator: CommandExpenseValidator,

    @Inject(Expense.name)
    private expenseModel: TenantModelProxy<typeof Expense>,

    @Inject(ExpenseCategory.name)
    private expenseCategoryModel: TenantModelProxy<typeof ExpenseCategory>,
  ) {}

  /**
   * Deletes the given expense.
   * @param {number} expenseId
   * @param {Knex.Transaction} trx - Database transaction instance.
   */
  public async deleteExpense(
    expenseId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    // Retrieves the expense transaction with associated entries or
    // throw not found error.
    const oldExpense = await this.expenseModel()
      .query()
      .findById(expenseId)
      .withGraphFetched('categories')
      .throwIfNotFound();

    // Validates the expense has no associated landed cost.
    await this.validator.validateNoAssociatedLandedCost(expenseId);

    // Deletes expense transactions with associated transactions under
    // unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onExpenseDeleting` event.
      await this.eventEmitter.emitAsync(events.expenses.onDeleting, {
        trx,
        oldExpense,
      } as IExpenseDeletingPayload);

      // Deletes expense associated entries.
      await this.expenseCategoryModel()
        .query(trx)
        .where('expenseId', expenseId)
        .delete();

      // Deletes expense transactions.
      await this.expenseModel().query(trx).findById(expenseId).delete();

      // Triggers `onExpenseDeleted` event.
      await this.eventEmitter.emitAsync(events.expenses.onDeleted, {
        expenseId,
        oldExpense,
        trx,
      } as IExpenseEventDeletePayload);
    }, trx);
  }
}
