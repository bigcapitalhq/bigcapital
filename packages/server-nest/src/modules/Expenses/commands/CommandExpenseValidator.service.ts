import { sumBy, difference } from 'lodash';
import { ERRORS, SUPPORTED_EXPENSE_PAYMENT_ACCOUNT_TYPES } from '../constants';
import { ACCOUNT_ROOT_TYPE } from '@/constants/accounts';
import { Account } from '@/modules/Accounts/models/Account.model';
import { Injectable } from '@nestjs/common';
import { Expense } from '../models/Expense.model';
import { ServiceError } from '@/modules/Items/ServiceError';
import { CreateExpenseDto, EditExpenseDto } from '../dtos/Expense.dto';

@Injectable()
export class CommandExpenseValidator {
  /**
   * Validates expense categories not equals zero.
   * @param  {IExpenseCreateDTO | IExpenseEditDTO} expenseDTO
   * @throws {ServiceError}
   */
  public validateCategoriesNotEqualZero = (
    expenseDTO: CreateExpenseDto | EditExpenseDto,
  ) => {
    const totalAmount = sumBy(expenseDTO.categories, 'amount') || 0;

    if (totalAmount <= 0) {
      throw new ServiceError(ERRORS.TOTAL_AMOUNT_EQUALS_ZERO);
    }
  };

  /**
   * Retrieve expense accounts or throw error in case one of the given accounts
   * not found not the storage.
   * @param {number} expenseAccountsIds
   * @throws {ServiceError}
   * @returns {Promise<IAccount[]>}
   */
  public validateExpensesAccountsExistance(
    expenseAccounts: Account[],
    DTOAccountsIds: number[],
  ) {
    const storedExpenseAccountsIds = expenseAccounts.map((a: Account) => a.id);
    const notStoredAccountsIds = difference(
      DTOAccountsIds,
      storedExpenseAccountsIds,
    );
    if (notStoredAccountsIds.length > 0) {
      throw new ServiceError(ERRORS.SOME_ACCOUNTS_NOT_FOUND);
    }
  }

  /**
   * Validate expenses accounts type.
   * @param {Account[]} expensesAccounts
   * @throws {ServiceError}
   */
  public validateExpensesAccountsType = (expensesAccounts: Account[]) => {
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
   * @param {Account} paymentAccount
   * @throws {ServiceError}
   */
  public validatePaymentAccountType = (paymentAccount: Account) => {
    if (
      !paymentAccount.isAccountType(SUPPORTED_EXPENSE_PAYMENT_ACCOUNT_TYPES)
    ) {
      throw new ServiceError(ERRORS.PAYMENT_ACCOUNT_HAS_INVALID_TYPE);
    }
  };

  /**
   * Validates the expense has not associated landed cost
   * references to the given expense.
   * @param {number} expenseId
   */
  public async validateNoAssociatedLandedCost(expenseId: number) {
    // const { BillLandedCost } = this.tenancy.models(tenantId);
    // const associatedLandedCosts = await BillLandedCost.query()
    //   .where('fromTransactionType', 'Expense')
    //   .where('fromTransactionId', expenseId);
    // if (associatedLandedCosts.length > 0) {
    //   throw new ServiceError(ERRORS.EXPENSE_HAS_ASSOCIATED_LANDED_COST);
    // }
  }

  /**
   * Validates expenses is not already published before.
   * @param {IExpense} expense
   */
  public validateExpenseIsNotPublished(expense: Expense) {
    if (expense.publishedAt) {
      throw new ServiceError(ERRORS.EXPENSE_ALREADY_PUBLISHED);
    }
  }
}
