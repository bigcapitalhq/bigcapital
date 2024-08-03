import { Service } from 'typedi';
import { includes, camelCase, upperFirst, sumBy } from 'lodash';
import { IAccount, IUncategorizedCashflowTransaction } from '@/interfaces';
import { getCashflowTransactionType } from './utils';
import { ServiceError } from '@/exceptions';
import {
  CASHFLOW_DIRECTION,
  CASHFLOW_TRANSACTION_TYPE,
  ERRORS,
} from './constants';
import CashflowTransaction from '@/models/CashflowTransaction';

@Service()
export class CommandCashflowValidator {
  /**
   * Validates the lines accounts type should be cash or bank account.
   * @param {IAccount} accounts -
   */
  public validateCreditAccountWithCashflowType = (
    creditAccount: IAccount,
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
   * @param   {string} transactionType
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
    cashflowTransaction: CashflowTransaction
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
    cashflowTransactions: Array<IUncategorizedCashflowTransaction>
  ) {
    const categorized = cashflowTransactions.filter((t) => t.categorized);

    if (categorized?.length > 0) {
      throw new ServiceError(ERRORS.TRANSACTION_ALREADY_CATEGORIZED, '', {
        ids: categorized.map((t) => t.id),
      });
    }
  }

  /**
   *
   * @param {uncategorizeTransaction}
   * @param {string} transactionType
   * @throws {ServiceError(ERRORS.UNCATEGORIZED_TRANSACTION_TYPE_INVALID)}
   */
  public validateUncategorizeTransactionType(
    uncategorizeTransactions: Array<IUncategorizedCashflowTransaction>,
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
