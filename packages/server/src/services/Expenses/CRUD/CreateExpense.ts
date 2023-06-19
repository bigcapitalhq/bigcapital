import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import events from '@/subscribers/events';
import {
  IExpense,
  IExpenseCreateDTO,
  ISystemUser,
  IExpenseCreatedPayload,
  IExpenseCreatingPayload,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import UnitOfWork from '@/services/UnitOfWork';
import { CommandExpenseValidator } from './CommandExpenseValidator';
import { ExpenseDTOTransformer } from './ExpenseDTOTransformer';

@Service()
export class CreateExpense {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private validator: CommandExpenseValidator;

  @Inject()
  private transformDTO: ExpenseDTOTransformer;

  /**
   * Authorize before create a new expense transaction.
   * @param {number} tenantId
   * @param {IExpenseDTO} expenseDTO
   */
  private authorize = async (
    tenantId: number,
    expenseDTO: IExpenseCreateDTO
  ) => {
    const { Account } = await this.tenancy.models(tenantId);

    // Validate payment account existence on the storage.
    const paymentAccount = await Account.query()
      .findById(expenseDTO.paymentAccountId)
      .throwIfNotFound();

    // Retrieves the DTO expense accounts ids.
    const DTOExpenseAccountsIds = expenseDTO.categories.map(
      (category) => category.expenseAccountId
    );
    // Retrieves the expenses accounts.
    const expenseAccounts = await Account.query().whereIn(
      'id',
      DTOExpenseAccountsIds
    );
    // Validate expense accounts exist on the storage.
    this.validator.validateExpensesAccountsExistence(
      expenseAccounts,
      DTOExpenseAccountsIds
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
   * 1. Validate payment account existence on the storage.
   * 2. Validate expense accounts exist on the storage.
   * 3. Validate payment account type.
   * 4. Validate expenses accounts type.
   * 5. Validate the expense payee contact id existence on storage.
   * 6. Validate the given expense categories not equal zero.
   * 7. Stores the expense to the storage.
   * ---------
   * @param {number} tenantId
   * @param {IExpenseDTO} expenseDTO
   */
  public newExpense = async (
    tenantId: number,
    expenseDTO: IExpenseCreateDTO,
    authorizedUser: ISystemUser
  ): Promise<IExpense> => {
    const { Expense } = await this.tenancy.models(tenantId);

    // Authorize before create a new expense.
    await this.authorize(tenantId, expenseDTO);

    // Save the expense to the storage.
    const expenseObj = await this.transformDTO.expenseCreateDTO(
      tenantId,
      expenseDTO,
      authorizedUser
    );
    // Writes the expense transaction with associated transactions under
    // unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onExpenseCreating` event.
      await this.eventPublisher.emitAsync(events.expenses.onCreating, {
        trx,
        tenantId,
        expenseDTO,
      } as IExpenseCreatingPayload);

      // Creates a new expense transaction graph.
      const expense: IExpense = await Expense.query(trx).upsertGraph(
        expenseObj
      );
      // Triggers `onExpenseCreated` event.
      await this.eventPublisher.emitAsync(events.expenses.onCreated, {
        tenantId,
        expenseId: expense.id,
        authorizedUser,
        expense,
        trx,
      } as IExpenseCreatedPayload);

      return expense;
    });
  };
}
