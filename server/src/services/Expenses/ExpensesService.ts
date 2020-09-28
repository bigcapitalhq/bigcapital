import { Service, Inject } from "typedi";
import { difference, sumBy } from 'lodash';
import moment from "moment";
import { ServiceError } from "exceptions";
import TenancyService from 'services/Tenancy/TenancyService';
import JournalPoster from 'services/Accounting/JournalPoster';
import JournalEntry from 'services/Accounting/JournalEntry';
import JournalCommands from 'services/Accounting/JournalCommands';
import { IExpense, IAccount, IExpenseDTO, IExpenseCategory, IExpensesService, ISystemUser } from 'interfaces';
import DynamicListingService from 'services/DynamicListing/DynamicListService';

const ERRORS = {
  EXPENSE_NOT_FOUND: 'expense_not_found',
  PAYMENT_ACCOUNT_NOT_FOUND: 'payment_account_not_found',
  SOME_ACCOUNTS_NOT_FOUND: 'some_expenses_not_found',
  TOTAL_AMOUNT_EQUALS_ZERO: 'total_amount_equals_zero',
  PAYMENT_ACCOUNT_HAS_INVALID_TYPE: 'payment_account_has_invalid_type',
  EXPENSES_ACCOUNT_HAS_INVALID_TYPE: 'expenses_account_has_invalid_type',
  EXPENSE_ACCOUNT_ALREADY_PUBLISED: 'expense_already_published',
};

@Service()
export default class ExpensesService implements IExpensesService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject('logger')
  logger: any;

  /**
   * Retrieve the payment account details or returns not found server error in case the 
   * given account not found on the storage.
   * @param   {number} tenantId 
   * @param   {number} paymentAccountId 
   * @returns {Promise<IAccount>}
   */
  private async getPaymentAccountOrThrowError(tenantId: number, paymentAccountId: number) {
    this.logger.info('[expenses] trying to get the given payment account.', { tenantId, paymentAccountId });

    const { accountRepository } = this.tenancy.repositories(tenantId);
    const paymentAccount = await accountRepository.getById(paymentAccountId)

    if (!paymentAccount) {
      this.logger.info('[expenses] the given payment account not found.', { tenantId, paymentAccountId });
      throw new ServiceError(ERRORS.PAYMENT_ACCOUNT_NOT_FOUND);
    }
    return paymentAccount;
  }

  /**
   * Retrieve expense accounts or throw error in case one of the given accounts
   * not found not the storage.
   * @param   {number} tenantId 
   * @param   {number} expenseAccountsIds 
   * @throws  {ServiceError}
   * @returns {Promise<IAccount[]>}
   */
  private async getExpensesAccountsOrThrowError(tenantId: number, expenseAccountsIds: number[]) {
    this.logger.info('[expenses] trying to get expenses accounts.', { tenantId, expenseAccountsIds });

    const { Account } = this.tenancy.models(tenantId);
    const storedExpenseAccounts = await Account.query().whereIn(
      'id', expenseAccountsIds,
    );
    const storedExpenseAccountsIds = storedExpenseAccounts.map((a: IAccount) => a.id);
    const notStoredAccountsIds = difference(
      expenseAccountsIds,
      storedExpenseAccountsIds
    );
    if (notStoredAccountsIds.length > 0) {
      this.logger.info('[expenses] some of expense accounts not found.', { tenantId, expenseAccountsIds });
      throw new ServiceError(ERRORS.SOME_ACCOUNTS_NOT_FOUND);
    }
    return storedExpenseAccounts;
  }

  /**
   * Validates expense categories not equals zero.
   * @param  {IExpenseDTO|ServiceError} expenseDTO 
   * @throws {ServiceError}
   */
  private validateCategoriesNotEqualZero(expenseDTO: IExpenseDTO) {
    this.logger.info('[expenses] validate the expenses categoires not equal zero.', { expenseDTO });
    const totalAmount = sumBy(expenseDTO.categories, 'amount') || 0;

    if (totalAmount <= 0) {
      this.logger.info('[expenses] the given expense categories equal zero.', { expenseDTO });
      throw new ServiceError(ERRORS.TOTAL_AMOUNT_EQUALS_ZERO);
    }
  }

  /**
   * Validate expenses accounts type.
   * @param {number} tenantId 
   * @param {number[]} expensesAccountsIds 
   */
  private async validateExpensesAccountsType(tenantId: number, expensesAccounts: number[]) {
    this.logger.info('[expenses] trying to validate expenses accounts type.', { tenantId, expensesAccounts });

    const { accountTypeRepository } = this.tenancy.repositories(tenantId);
    const expensesTypes = await accountTypeRepository.getByRootType('expense');
    const expensesTypesIds = expensesTypes.map(t => t.id);
    const invalidExpenseAccounts: number[] = [];

    expensesAccounts.forEach((expenseAccount) => {
      if (expensesTypesIds.indexOf(expenseAccount.accountTypeId) === -1) {
        invalidExpenseAccounts.push(expenseAccount.id);
      }
    });
    if (invalidExpenseAccounts.length > 0) {
      throw new ServiceError(ERRORS.EXPENSES_ACCOUNT_HAS_INVALID_TYPE);
    }
  }

  /**
   * Validates payment account type in case has invalid type throws errors.
   * @param  {number} tenantId 
   * @param  {number} paymentAccountId 
   * @throws {ServiceError}
   */
  private async validatePaymentAccountType(tenantId: number, paymentAccount: number[]) {
    this.logger.info('[expenses] trying to validate payment account type.', { tenantId, paymentAccount });

    const { accountTypeRepository } = this.tenancy.repositories(tenantId);
    const validAccountsType = await accountTypeRepository.getByKeys([
      'current_asset', 'fixed_asset',
    ]);
    const validAccountsTypeIds = validAccountsType.map(t => t.id);

    if (validAccountsTypeIds.indexOf(paymentAccount.accountTypeId) === -1) {
      this.logger.info('[expenses] the given payment account has invalid type', { tenantId, paymentAccount });
      throw new ServiceError(ERRORS.PAYMENT_ACCOUNT_HAS_INVALID_TYPE);
    }
  }

  private async revertJournalEntries(
    tenantId: number,
    expenseId: number|number[],
  ) {
    const journal = new JournalPoster(tenantId);
    const journalCommands = new JournalCommands(journal);

    if (revertOld) {
      await journalCommands.revertJournalEntries(expenseId, 'Expense');
    }
    return Promise.all([
      journal.saveBalance(),
      journal.deleteEntries(),
    ]);
  }

  /**
   * Writes expense journal entries.
   * @param {number} tenantId 
   * @param {IExpense} expense 
   * @param {IUser} authorizedUser 
   */
  private async writeJournalEntries(
    tenantId: number,
    expense: IExpense,
    revertOld: boolean,
    authorizedUser: ISystemUser
  ) {
    this.logger.info('[expense[ trying to write expense journal entries.', { tenantId, expense });
    const journal = new JournalPoster(tenantId);
    const journalCommands = new JournalCommands(journal);

    if (revertOld) {
      await journalCommands.revertJournalEntries(expense.id, 'Expense');
    }
    const mixinEntry = {
      referenceType: 'Expense',
      referenceId: expense.id,
      date: expense.paymentDate,
      userId: authorizedUser.id,
      draft: !expense.publish,
    };
    const paymentJournalEntry = new JournalEntry({
      credit: expense.totalAmount,
      account: expense.paymentAccountId,
      ...mixinEntry,
    });
    journal.credit(paymentJournalEntry);

    expense.categories.forEach((category: IExpenseCategory) => {
      const expenseJournalEntry = new JournalEntry({
        account: category.expenseAccountId,
        debit: category.amount,
        note: category.description,
        ...mixinEntry,
      });
      journal.debit(expenseJournalEntry);
    });
    return Promise.all([
      journal.saveBalance(),
      journal.saveEntries(),
      journal.deleteEntries(),
    ]);
  }

  /**
   * Retrieve the given expenses or throw not found error.
   * @param   {number} tenantId 
   * @param   {number} expenseId 
   * @returns {IExpense|ServiceError}
   */
  private async getExpenseOrThrowError(tenantId: number, expenseId: number) {
    const { expenseRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[expense] trying to get the given expense.', { tenantId, expenseId });
    const expense = await expenseRepository.getById(expenseId);

    if (!expense) {
      this.logger.info('[expense] the given expense not found.', { tenantId, expenseId });
      throw new ServiceError(ERRORS.EXPENSE_NOT_FOUND);
    }
    return expense;
  }

  async getExpensesOrThrowError(tenantId: number, expensesIds: number[]) {

  }

  /**
   * Validates expenses is not already published before.
   * @param {IExpense} expense 
   */
  private validateExpenseIsNotPublished(expense: IExpense) {
    if (expense.published) {
      throw new ServiceError(ERRORS.EXPENSE_ACCOUNT_ALREADY_PUBLISED);
    }
  }

  /**
   * Mapping expense DTO to model.
   * @param  {IExpenseDTO} expenseDTO 
   * @param  {ISystemUser} authorizedUser
   * @return {IExpense}
   */
  private expenseDTOToModel(expenseDTO: IExpenseDTO, user?: ISystemUser) {
    const totalAmount = sumBy(expenseDTO.categories, 'amount');

    return {
      published: false,
      categories: [],
      ...expenseDTO,
      totalAmount,
      paymentDate: moment(expenseDTO.paymentDate).toMySqlDateTime(),
      ...(user) ? {
        userId: user.id,
      } : {},
    }
  }

  /**
   * Mapping the expenses accounts ids from expense DTO.
   * @param  {IExpenseDTO} expenseDTO 
   * @return {number[]}
   */
  mapExpensesAccountsIdsFromDTO(expenseDTO: IExpenseDTO) {
    return expenseDTO.categories.map((category) => category.expenseAccountId);
  }

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
    expenseDTO: IExpenseDTO,
    authorizedUser: ISystemUser
  ): Promise<IExpense> {
    const { expenseRepository } = this.tenancy.repositories(tenantId);
    const expense = await this.getExpenseOrThrowError(tenantId, expenseId);

     // 1. Validate payment account existance on the storage.
     const paymentAccount = await this.getPaymentAccountOrThrowError(
      tenantId,
      expenseDTO.paymentAccountId,
    );
    // 2. Validate expense accounts exist on the storage.
    const expensesAccounts = await this.getExpensesAccountsOrThrowError(
      tenantId,
      this.mapExpensesAccountsIdsFromDTO(expenseDTO),
    );
    // 3. Validate payment account type.
    await this.validatePaymentAccountType(tenantId, paymentAccount);

    // 4. Validate expenses accounts type.
    await this.validateExpensesAccountsType(tenantId, expensesAccounts);

    // 5. Validate the given expense categories not equal zero.
    this.validateCategoriesNotEqualZero(expenseDTO);

    // 6. Update the expense on the storage.
    const expenseObj = this.expenseDTOToModel(expenseDTO);
    const expenseModel = await expenseRepository.update(expenseId, expenseObj, null);

    // 7. In case expense published, write journal entries.
    if (expenseObj.published) {
      await this.writeJournalEntries(tenantId, expenseModel, true, authorizedUser);
    }
    this.logger.info('[expense] the expense updated on the storage successfully.', { tenantId, expenseDTO });
    return expenseModel;
  }

  /**
   * Precedures.
   * ---------
   * 1. Validate payment account existance on the storage.
   * 2. Validate expense accounts exist on the storage.
   * 3. Validate payment account type.
   * 4. Validate expenses accounts type.
   * 5. Validate the given expense categories not equal zero.
   * 6. Stores the expense to the storage.
   * ---------
   * @param {number} tenantId 
   * @param {IExpenseDTO} expenseDTO 
   */
  public async newExpense(
    tenantId: number,
    expenseDTO: IExpenseDTO,
    authorizedUser: ISystemUser,
  ): Promise<IExpense> {
    const { expenseRepository } = this.tenancy.repositories(tenantId);

    // 1. Validate payment account existance on the storage.
    const paymentAccount = await this.getPaymentAccountOrThrowError(
      tenantId,
      expenseDTO.paymentAccountId,
    );
    // 2. Validate expense accounts exist on the storage.
    const expensesAccounts = await this.getExpensesAccountsOrThrowError(
      tenantId,
      this.mapExpensesAccountsIdsFromDTO(expenseDTO),
    );
    // 3. Validate payment account type.
    await this.validatePaymentAccountType(tenantId, paymentAccount);

    // 4. Validate expenses accounts type.
    await this.validateExpensesAccountsType(tenantId, expensesAccounts);

    // 5. Validate the given expense categories not equal zero.
    this.validateCategoriesNotEqualZero(expenseDTO);

    // 6. Save the expense to the storage.
    const expenseObj = this.expenseDTOToModel(expenseDTO, authorizedUser);
    const expenseModel = await expenseRepository.create(expenseObj);
    
    // 7. In case expense published, write journal entries.
    if (expenseObj.published) {
      await this.writeJournalEntries(tenantId, expenseModel, false, authorizedUser);    
    }
    this.logger.info('[expense] the expense stored to the storage successfully.', { tenantId, expenseDTO });

    return expenseModel;
  }

  /**
   * Publish the given expense.
   * @param {number} tenantId 
   * @param {number} expenseId 
   * @param {ISystemUser} authorizedUser
   * @return {Promise<void>}
   */
  public async publishExpense(tenantId: number, expenseId: number, authorizedUser: ISystemUser) {
    const { expenseRepository } = this.tenancy.repositories(tenantId);
    const expense = await this.getExpenseOrThrowError(tenantId, expenseId);

    if (expense instanceof ServiceError) {
      throw expense;
    }
    this.validateExpenseIsNotPublished(expense);

    this.logger.info('[expense] trying to publish the expense.', { tenantId, expenseId });
    await expenseRepository.publish(expenseId);

    this.logger.info('[expense] the expense published successfully.', { tenantId, expenseId });
  }

  /**
   * Deletes the given expense.
   * @param {number} tenantId 
   * @param {number} expenseId 
   * @param {ISystemUser} authorizedUser
   */
  public async deleteExpense(tenantId: number, expenseId: number, authorizedUser: ISystemUser) {
    const expense = await this.getExpenseOrThrowError(tenantId, expenseId);
    const { expenseRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[expense] trying to delete the expense.', { tenantId, expenseId });
    await expenseRepository.delete(expenseId);

    if (expense.published) {
      await this.revertJournalEntries(tenantId, expenseId);
    }
    this.logger.info('[expense] the expense deleted successfully.', { tenantId, expenseId });
  }

  /**
   * Deletes the given expenses in bulk.
   * @param {number} tenantId 
   * @param {number[]} expensesIds 
   * @param {ISystemUser} authorizedUser
   */
  public async deleteBulkExpenses(tenantId: number, expensesIds: number[], authorizedUser: ISystemUser) {
    const expenses = await this.getExpensesOrThrowError(tenantId, expensesIds);
    const { expenseRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[expense] trying to delete the given expenses.', { tenantId, expensesIds });
    await expenseRepository.bulkDelete(expensesIds);
    await this.revertJournalEntries(tenantId, expensesIds);

    this.logger.info('[expense] the given expenses deleted successfully.', { tenantId, expensesIds });
  }

  /**
   * Deletes the given expenses in bulk.
   * @param {number} tenantId 
   * @param {number[]} expensesIds 
   * @param {ISystemUser} authorizedUser
   */
  public async publishBulkExpenses(tenantId: number, expensesIds: number[], authorizedUser: ISystemUser) {
    const expenses = await this.getExpensesOrThrowError(tenantId, expensesIds);
    const { expenseRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[expense] trying to publish the given expenses.', { tenantId, expensesIds });
    await expenseRepository.publishBulk(expensesIds);

    this.logger.info('[expense] the given expenses ids published successfully.', { tenantId, expensesIds });
  }

  /**
   * Retrieve expenses datatable lsit.
   * @param  {number} tenantId 
   * @param  {IExpensesFilter} expensesFilter 
   * @return {IExpense[]}
   */
  public async getExpensesList(tenantId: number, expensesFilter: IExpensesFilter) {
    const { Expense } = this.tenancy.models(tenantId);
    const dynamicFilter = await this.dynamicListService.dynamicList(tenantId, Expense, expensesFilter);

    this.logger.info('[expense] trying to get expenses datatable list.', { tenantId, expensesFilter });
    const expenses = await Expense.query().onBuild((builder) => {
      builder.withGraphFetched('paymentAccount');
      builder.withGraphFetched('user');

      dynamicFilter.buildQuery()(builder);
    });
    return expenses;
  }
}