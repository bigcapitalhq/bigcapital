import { Injectable } from '@nestjs/common';
import { includes, camelCase, upperFirst, sumBy } from 'lodash';
import { getCashflowTransactionType } from '../utils';
import {
  CASHFLOW_DIRECTION,
  CASHFLOW_TRANSACTION_TYPE,
  ERRORS,
} from '../constants';
import { Account } from '@/modules/Accounts/models/Account.model';
import { ServiceError } from '@/modules/Items/ServiceError';
import { BankTransaction } from '../models/BankTransaction';
import { UncategorizedBankTransaction } from '../models/UncategorizedBankTransaction';

@Injectable()
export class CommandBankTransactionValidator {
  /**
   * Validates the lines accounts type should be cash or bank account.
   * @param {Account} accounts -
   */
  public validateCreditAccountWithCashflowType = (
    creditAccount: Account,
    cashflowTransactionType: CASHFLOW_TRANSACTION_TYPE
  ): void => {
    const transactionTypeMeta = getCashflowTransactionType(
      cashflowTransactionType
    );
    const noneCashflowAccount = !includes(
      transactionTypeMeta.creditType,
      creditAccount.accountType
    );
    if (noneCashflowAccount) {
      throw new ServiceError(ERRORS.CREDIT_ACCOUNTS_HAS_INVALID_TYPE);
    }
  };

  /**
   * Validates the cashflow transaction type.
   * @param {string} transactionType
   * @returns {string}
   */
  public validateCashflowTransactionType = (transactionType: string) => {
    const transformedType = upperFirst(
      camelCase(transactionType)
    ) as CASHFLOW_TRANSACTION_TYPE;

    // Retrieve the given transaction type meta.
    const transactionTypeMeta = getCashflowTransactionType(transformedType);

    // Throw service error in case not the found the given transaction type.
    if (!transactionTypeMeta) {
      throw new ServiceError(ERRORS.CASHFLOW_TRANSACTION_TYPE_INVALID);
    }
    return transformedType;
  };

  /**
   * Validate the given transaction should be categorized.
   * @param {CashflowTransaction} cashflowTransaction
   */
  public validateTransactionShouldCategorized(
    cashflowTransaction: BankTransaction
  ) {
    if (!cashflowTransaction.uncategorize) {
      throw new ServiceError(ERRORS.TRANSACTION_ALREADY_CATEGORIZED);
    }
  }

  /**
   * Validate the given transcation shouldn't be categorized.
   * @param {CashflowTransaction} cashflowTransaction
   */
  public validateTransactionsShouldNotCategorized(
    cashflowTransactions: Array<UncategorizedBankTransaction>
  ) {
    const categorized = cashflowTransactions.filter((t) => t.categorized);

    if (categorized?.length > 0) {
      throw new ServiceError(ERRORS.TRANSACTION_ALREADY_CATEGORIZED, '', {
        ids: categorized.map((t) => t.id),
      });
    }
  }

  /**
   * Validate the uncategorize transaction type.
   * @param {uncategorizeTransaction}
   * @param {string} transactionType
   * @throws {ServiceError(ERRORS.UNCATEGORIZED_TRANSACTION_TYPE_INVALID)}
   */
  public validateUncategorizeTransactionType(
    uncategorizeTransactions: Array<UncategorizedBankTransaction>,
    transactionType: string
  ) {
    const amount = sumBy(uncategorizeTransactions, 'amount');
    const isDepositTransaction = amount > 0;
    const isWithdrawalTransaction = amount <= 0;

    const type = getCashflowTransactionType(
      transactionType as CASHFLOW_TRANSACTION_TYPE
    );
    if (
      (type.direction === CASHFLOW_DIRECTION.IN && isDepositTransaction) ||
      (type.direction === CASHFLOW_DIRECTION.OUT && isWithdrawalTransaction)
    ) {
      return;
    }
    throw new ServiceError(ERRORS.UNCATEGORIZED_TRANSACTION_TYPE_INVALID);
  }
}
