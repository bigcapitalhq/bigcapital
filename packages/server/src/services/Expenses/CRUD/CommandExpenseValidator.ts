import { Service, Inject } from 'typedi';
import { sumBy, difference } from 'lodash';
import { ServiceError } from '@/exceptions';
import { ERRORS } from '../constants';
import {
  IAccount,
  IExpense,
  IExpenseCreateDTO,
  IExpenseEditDTO,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ACCOUNT_PARENT_TYPE, ACCOUNT_ROOT_TYPE } from '@/data/AccountTypes';

@Service()
export class CommandExpenseValidator {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Validates expense categories not equals zero.
   * @param  {IExpenseCreateDTO | IExpenseEditDTO} expenseDTO
   * @throws {ServiceError}
   */
  public validateCategoriesNotEqualZero = (
    expenseDTO: IExpenseCreateDTO | IExpenseEditDTO
  ) => {
    const totalAmount = sumBy(expenseDTO.categories, 'amount') || 0;

    if (totalAmount <= 0) {
      throw new ServiceError(ERRORS.TOTAL_AMOUNT_EQUALS_ZERO);
    }
  };

  /**
   * Retrieve expense accounts or throw error in case one of the given accounts
   * not found not the storage.
   * @param   {number} tenantId
   * @param   {number} expenseAccountsIds
   * @throws  {ServiceError}
   * @returns {Promise<IAccount[]>}
   */
  public validateExpensesAccountsExistence(
    expenseAccounts: IAccount[],
    DTOAccountsIds: number[]
  ) {
    const storedExpenseAccountsIds = expenseAccounts.map((a: IAccount) => a.id);

    const notStoredAccountsIds = difference(
      DTOAccountsIds,
      storedExpenseAccountsIds
    );
    if (notStoredAccountsIds.length > 0) {
      throw new ServiceError(ERRORS.SOME_ACCOUNTS_NOT_FOUND);
    }
  }

  /**
   * Validate expenses accounts type.
   * @param {number} tenantId
   * @param {number[]} expensesAccountsIds
   */
  public validateExpensesAccountsType = (expensesAccounts: IAccount[]) => {
    const invalidExpenseAccounts: number[] = [];

    expensesAccounts.forEach((expenseAccount) => {
      if (!expenseAccount.isRootType(ACCOUNT_ROOT_TYPE.EXPENSE)) {
        invalidExpenseAccounts.push(expenseAccount.id);
      }
    });
    if (invalidExpenseAccounts.length > 0) {
      throw new ServiceError(ERRORS.EXPENSES_ACCOUNT_HAS_INVALID_TYPE);
    }
  };

  /**
   * Validates payment account type in case has invalid type throws errors.
   * @param  {number} tenantId
   * @param  {number} paymentAccountId
   * @throws {ServiceError}
   */
  public validatePaymentAccountType = (paymentAccount: number[]) => {
    if (!paymentAccount.isParentType(ACCOUNT_PARENT_TYPE.CURRENT_ASSET)) {
      throw new ServiceError(ERRORS.PAYMENT_ACCOUNT_HAS_INVALID_TYPE);
    }
  };

  /**
   * Validates the expense has not associated landed cost
   * references to the given expense.
   * @param {number} tenantId
   * @param {number} expenseId
   */
  public async validateNoAssociatedLandedCost(
    tenantId: number,
    expenseId: number
  ) {
    const { BillLandedCost } = this.tenancy.models(tenantId);

    const associatedLandedCosts = await BillLandedCost.query()
      .where('fromTransactionType', 'Expense')
      .where('fromTransactionId', expenseId);

    if (associatedLandedCosts.length > 0) {
      throw new ServiceError(ERRORS.EXPENSE_HAS_ASSOCIATED_LANDED_COST);
    }
  }

  /**
   * Validates expenses is not already published before.
   * @param {IExpense} expense
   */
  public validateExpenseIsNotPublished(expense: IExpense) {
    if (expense.publishedAt) {
      throw new ServiceError(ERRORS.EXPENSE_ALREADY_PUBLISHED);
    }
  }
}
