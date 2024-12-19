import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  IExpenseCreateDTO,
  IExpenseCreatedPayload,
  IExpenseCreatingPayload,
} from '../interfaces/Expenses.interface';
import { CommandExpenseValidator } from './CommandExpenseValidator.service';
import { ExpenseDTOTransformer } from './ExpenseDTOTransformer';
import { Account } from '@/modules/Accounts/models/Account.model';
import { Expense } from '@/modules/Expenses/models/Expense.model';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';

@Injectable()
export class CreateExpense {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly validator: CommandExpenseValidator,
    private readonly transformDTO: ExpenseDTOTransformer,

    @Inject(Account.name)
    private readonly accountModel: typeof Account,

    @Inject(Expense.name)
    private readonly expenseModel: typeof Expense,
  ) {}

  /**
   * Authorize before create a new expense transaction.
   * @param {IExpenseDTO} expenseDTO
   */
  private authorize = async (expenseDTO: IExpenseCreateDTO) => {
    // Validate payment account existance on the storage.
    const paymentAccount = await this.accountModel
      .query()
      .findById(expenseDTO.paymentAccountId)
      .throwIfNotFound();

    // Retrieves the DTO expense accounts ids.
    const DTOExpenseAccountsIds = expenseDTO.categories.map(
      (category) => category.expenseAccountId,
    );
    // Retrieves the expenses accounts.
    const expenseAccounts = await this.accountModel
      .query()
      .whereIn('id', DTOExpenseAccountsIds);
    // Validate expense accounts exist on the storage.
    this.validator.validateExpensesAccountsExistance(
      expenseAccounts,
      DTOExpenseAccountsIds,
    );
    // Validate payment account type.
    this.validator.validatePaymentAccountType(paymentAccount);

    // Validate expenses accounts type.
    this.validator.validateExpensesAccountsType(expenseAccounts);

    // Validate the given expense categories not equal zero.
    this.validator.validateCategoriesNotEqualZero(expenseDTO);
  };

  /**
   * Precedures.
   * ---------
   * 1. Validate payment account existance on the storage.
   * 2. Validate expense accounts exist on the storage.
   * 3. Validate payment account type.
   * 4. Validate expenses accounts type.
   * 5. Validate the expense payee contact id existance on storage.
   * 6. Validate the given expense categories not equal zero.
   * 7. Stores the expense to the storage.
   * ---------
   * @param {number} tenantId
   * @param {IExpenseDTO} expenseDTO
   */
  public newExpense = async (
    expenseDTO: IExpenseCreateDTO,
    trx?: Knex.Transaction,
  ): Promise<Expense> => {
    // Authorize before create a new expense.
    await this.authorize(expenseDTO);

    // Save the expense to the storage.
    const expenseObj = await this.transformDTO.expenseCreateDTO(expenseDTO);

    // Writes the expense transaction with associated transactions under
    // unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onExpenseCreating` event.
      await this.eventEmitter.emitAsync(events.expenses.onCreating, {
        trx,
        expenseDTO,
      } as IExpenseCreatingPayload);

      // Creates a new expense transaction graph.
      const expense = await this.expenseModel
        .query(trx)
        .upsertGraph(expenseObj);
      // Triggers `onExpenseCreated` event.
      await this.eventEmitter.emitAsync(events.expenses.onCreated, {
        expenseId: expense.id,
        expenseDTO,
        expense,
        trx,
      } as IExpenseCreatedPayload);

      return expense;
    }, trx);
  };
}
