import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import {
  IExpenseEventEditPayload,
  IExpenseEventEditingPayload,
} from '../interfaces/Expenses.interface';
import { CommandExpenseValidator } from './CommandExpenseValidator.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExpenseDTOTransformer } from './CommandExpenseDTO.transformer';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { Account } from '@/modules/Accounts/models/Account.model';
import { Expense } from '../models/Expense.model';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { EditExpenseDto } from '../dtos/Expense.dto';

@Injectable()
export class EditExpense {
  /**
   * @param {EventEmitter2} eventEmitter - Event emitter.
   * @param {UnitOfWork} uow - Unit of work.
   * @param {CommandExpenseValidator} validator - Command expense validator.
   * @param {ExpenseDTOTransformer} transformDTO - Expense DTO transformer.
   * @param {typeof Expense} expenseModel - Expense model.
   * @param {typeof Account} accountModel - Account model.
   */
  constructor(
    private eventEmitter: EventEmitter2,
    private uow: UnitOfWork,
    private validator: CommandExpenseValidator,
    private transformDTO: ExpenseDTOTransformer,
    @Inject(Expense.name)
    private expenseModel: TenantModelProxy<typeof Expense>,

    @Inject(Account.name)
    private accountModel: TenantModelProxy<typeof Account>,
  ) {}

  /**
   * Authorize the DTO before editing expense transaction.
   * @param {EditExpenseDto} expenseDTO
   */
  public authorize = async (
    oldExpense: Expense,
    expenseDTO: EditExpenseDto,
  ) => {
    // Validate payment account existance on the storage.
    const paymentAccount = await this.accountModel()
      .query()
      .findById(expenseDTO.paymentAccountId)
      .throwIfNotFound();

    // Retrieves the DTO expense accounts ids.
    const DTOExpenseAccountsIds = expenseDTO.categories.map(
      (category) => category.expenseAccountId,
    );
    // Retrieves the expenses accounts.
    const expenseAccounts = await this.accountModel()
      .query()
      .whereIn('id', DTOExpenseAccountsIds);
    // Validate expense accounts exist on the storage.
    this.validator.validateExpensesAccountsExistance(
      expenseAccounts,
      DTOExpenseAccountsIds,
    );
    // Validate payment account type.
    await this.validator.validatePaymentAccountType(paymentAccount);

    // Validate expenses accounts type.
    await this.validator.validateExpensesAccountsType(expenseAccounts);
    // Validate the given expense categories not equal zero.
    this.validator.validateCategoriesNotEqualZero(expenseDTO);

    // Validate expense entries that have allocated landed cost cannot be deleted.
    // this.entriesService.validateLandedCostEntriesNotDeleted(
    //   oldExpense.categories,
    //   expenseDTO.categories,
    // );
    // // Validate expense entries that have allocated cost amount should be bigger than amount.
    // this.entriesService.validateLocatedCostEntriesSmallerThanNewEntries(
    //   oldExpense.categories,
    //   expenseDTO.categories,
    // );
  };

  /**
   * Precedures.
   * ---------
   * 1. Validate expense existance.
   * 2. Validate payment account existance on the storage.
   * 3. Validate expense accounts exist on the storage.
   * 4. Validate payment account type.
   * 5. Validate expenses accounts type.
   * 6. Validate the given expense categories not equal zero.
   * 7. Stores the expense to the storage.
   * ---------
   * @param {number} expenseId
   * @param {IExpenseDTO} expenseDTO
   * @param {ISystemUser} authorizedUser
   */
  public async editExpense(
    expenseId: number,
    expenseDTO: EditExpenseDto,
  ): Promise<Expense> {
    // Retrieves the expense model or throw not found error.
    const oldExpense = await this.expenseModel()
      .query()
      .findById(expenseId)
      .withGraphFetched('categories')
      .throwIfNotFound();

    // Authorize expense DTO before editing.
    await this.authorize(oldExpense, expenseDTO);

    // Update the expense on the storage.
    const expenseObj = await this.transformDTO.expenseEditDTO(expenseDTO);

    // Edits expense transactions and associated transactions under UOW envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onExpenseEditing` event.
      await this.eventEmitter.emitAsync(events.expenses.onEditing, {
        oldExpense,
        expenseDTO,
        trx,
      } as IExpenseEventEditingPayload);

      // Upsert the expense object with expense entries.
      const expense = await this.expenseModel()
        .query(trx)
        .upsertGraphAndFetch({
          id: expenseId,
          ...expenseObj,
        });

      // Triggers `onExpenseCreated` event.
      await this.eventEmitter.emitAsync(events.expenses.onEdited, {
        expenseId,
        expense,
        expenseDTO,
        oldExpense,
        trx,
      } as IExpenseEventEditPayload);

      return expense;
    });
  }
}
