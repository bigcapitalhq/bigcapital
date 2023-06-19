import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import {
  IExpense,
  ISystemUser,
  IExpenseEventEditPayload,
  IExpenseEventEditingPayload,
  IExpenseEditDTO,
} from '@/interfaces';
import events from '@/subscribers/events';
import { CommandExpenseValidator } from './CommandExpenseValidator';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ExpenseDTOTransformer } from './ExpenseDTOTransformer';
import EntriesService from '@/services/Entries';

@Service()
export class EditExpense {
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

  @Inject()
  private entriesService: EntriesService;

  /**
   * Authorize the DTO before editing expense transaction.
   * @param {number} tenantId
   * @param {number} expenseId
   * @param {IExpenseEditDTO} expenseDTO
   */
  public authorize = async (
    tenantId: number,
    oldExpense: IExpense,
    expenseDTO: IExpenseEditDTO
  ) => {
    const { Account } = this.tenancy.models(tenantId);

    // Validate payment account existance on the storage.
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
    this.validator.validateExpensesAccountsExistance(
      expenseAccounts,
      DTOExpenseAccountsIds
    );
    // Validate payment account type.
    await this.validator.validatePaymentAccountType(paymentAccount);

    // Validate expenses accounts type.
    await this.validator.validateExpensesAccountsType(expenseAccounts);
    // Validate the given expense categories not equal zero.
    this.validator.validateCategoriesNotEqualZero(expenseDTO);

    // Validate expense entries that have allocated landed cost cannot be deleted.
    this.entriesService.validateLandedCostEntriesNotDeleted(
      oldExpense.categories,
      expenseDTO.categories
    );
    // Validate expense entries that have allocated cost amount should be bigger than amount.
    this.entriesService.validateLocatedCostEntriesSmallerThanNewEntries(
      oldExpense.categories,
      expenseDTO.categories
    );
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
   * @param {number} tenantId
   * @param {number} expenseId
   * @param {IExpenseDTO} expenseDTO
   * @param {ISystemUser} authorizedUser
   */
  public async editExpense(
    tenantId: number,
    expenseId: number,
    expenseDTO: IExpenseEditDTO,
    authorizedUser: ISystemUser
  ): Promise<IExpense> {
    const { Expense } = this.tenancy.models(tenantId);

    // Retrieves the expense model or throw not found error.
    const oldExpense = await Expense.query()
      .findById(expenseId)
      .withGraphFetched('categories')
      .throwIfNotFound();

    // Authorize expense DTO before editing.
    await this.authorize(tenantId, oldExpense, expenseDTO);

    // Update the expense on the storage.
    const expenseObj = await this.transformDTO.expenseEditDTO(
      tenantId,
      expenseDTO
    );
    // Edits expense transactions and associated transactions under UOW environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onExpenseEditing` event.
      await this.eventPublisher.emitAsync(events.expenses.onEditing, {
        tenantId,
        oldExpense,
        expenseDTO,
        trx,
      } as IExpenseEventEditingPayload);

      // Upsert the expense object with expense entries.
      const expense: IExpense = await Expense.query(trx).upsertGraph({
        id: expenseId,
        ...expenseObj,
      });
      // Triggers `onExpenseCreated` event.
      await this.eventPublisher.emitAsync(events.expenses.onEdited, {
        tenantId,
        expenseId,
        expense,
        expenseDTO,
        authorizedUser,
        oldExpense,
        trx,
      } as IExpenseEventEditPayload);

      return expense;
    });
  }
}
