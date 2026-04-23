import { sumBy, difference, uniq } from 'lodash';
import { ERRORS, SUPPORTED_EXPENSE_PAYMENT_ACCOUNT_TYPES } from '../constants';
import { ACCOUNT_ROOT_TYPE } from '@/constants/accounts';
import { Account } from '@/modules/Accounts/models/Account.model';
import { Injectable } from '@nestjs/common';
import { Expense } from '../models/Expense.model';
import { ServiceError } from '@/modules/Items/ServiceError';
import {
  CreateExpenseDto,
  EditExpenseDto,
  ExpensePaymentSplitDto,
} from '../dtos/Expense.dto';

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
   * Resolves the effective payment splits for a DTO: either the provided
   * `paymentSplits` array, or a synthesized single-split list from the
   * legacy `paymentAccountId` + categories total.
   */
  public resolvePaymentSplits = (
    expenseDTO: CreateExpenseDto | EditExpenseDto,
  ): ExpensePaymentSplitDto[] => {
    const provided = (expenseDTO.paymentSplits || []).filter(
      (s) => s && s.paymentAccountId != null,
    );
    if (provided.length > 0) return provided;

    if (expenseDTO.paymentAccountId != null) {
      const total = sumBy(expenseDTO.categories || [], 'amount') || 0;
      return [
        {
          index: 1,
          paymentAccountId: expenseDTO.paymentAccountId,
          amount: total,
        },
      ];
    }
    return [];
  };

  /**
   * Validates that each payment split references an existing payment-type
   * account. Mirrors the single-account check for the split payment case.
   */
  public validatePaymentSplits = (
    splits: ExpensePaymentSplitDto[],
    accounts: Account[],
  ) => {
    if (!splits || splits.length === 0) {
      throw new ServiceError(ERRORS.PAYMENT_ACCOUNT_HAS_INVALID_TYPE);
    }
    const byId = new Map(accounts.map((a) => [a.id, a]));
    for (const split of splits) {
      const acc = byId.get(split.paymentAccountId);
      if (!acc) {
        throw new ServiceError(ERRORS.PAYMENT_ACCOUNT_HAS_INVALID_TYPE);
      }
      if (!acc.isAccountType(SUPPORTED_EXPENSE_PAYMENT_ACCOUNT_TYPES)) {
        throw new ServiceError(ERRORS.PAYMENT_ACCOUNT_HAS_INVALID_TYPE);
      }
      if (!(split.amount > 0)) {
        throw new ServiceError(ERRORS.TOTAL_AMOUNT_EQUALS_ZERO);
      }
    }
  };

  /**
   * Validates that the sum of payment splits matches the sum of categories
   * within a rounding tolerance. Percent-typed categories round to 3dp each,
   * so a common 33/33/33 % split drifts by ~0.01 from the total; widen the
   * tolerance proportionally so legitimate splits are not rejected.
   */
  public validatePaymentSplitsSum = (
    expenseDTO: CreateExpenseDto | EditExpenseDto,
    splits: ExpensePaymentSplitDto[],
  ) => {
    const categoriesTotal = sumBy(expenseDTO.categories || [], 'amount') || 0;
    const splitsTotal = sumBy(splits, 'amount') || 0;
    const percentRows = (expenseDTO.categories || []).filter(
      (c) => c.amountType === 'percent',
    ).length;
    const tolerance = 0.005 + 0.005 * percentRows;
    if (Math.abs(categoriesTotal - splitsTotal) > tolerance) {
      throw new ServiceError(
        ERRORS.EXPENSE_PAYMENT_SPLITS_MISMATCH,
        'The total of payment splits must equal the total of expense categories.',
      );
    }
  };

  /**
   * Collects unique payment account ids from a splits array.
   */
  public collectPaymentAccountIds = (
    splits: ExpensePaymentSplitDto[],
  ): number[] => uniq(splits.map((s) => s.paymentAccountId));

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
