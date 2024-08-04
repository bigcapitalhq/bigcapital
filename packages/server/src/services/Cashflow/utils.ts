import { upperFirst, camelCase, first, sum, sumBy } from 'lodash';
import {
  CASHFLOW_TRANSACTION_TYPE,
  CASHFLOW_TRANSACTION_TYPE_META,
  ERRORS,
  ICashflowTransactionTypeMeta,
} from './constants';
import {
  ICashflowNewCommandDTO,
  ICategorizeCashflowTransactioDTO,
  IUncategorizedCashflowTransaction,
} from '@/interfaces';
import { UncategorizeCashflowTransaction } from './UncategorizeCashflowTransaction';
import { ServiceError } from '@/exceptions';

/**
 * Ensures the given transaction type to transformed to appropriate format.
 * @param {string} type
 * @returns {string}
 */
export const transformCashflowTransactionType = (type) => {
  return upperFirst(camelCase(type));
};

/**
 * Retrieve the cashflow transaction type meta.
 * @param {CASHFLOW_TRANSACTION_TYPE} transactionType
 * @returns {ICashflowTransactionTypeMeta}
 */
export function getCashflowTransactionType(
  transactionType: CASHFLOW_TRANSACTION_TYPE
): ICashflowTransactionTypeMeta {
  const _transactionType = transformCashflowTransactionType(transactionType);

  return CASHFLOW_TRANSACTION_TYPE_META[_transactionType];
}

/**
 * Retrieve cashflow accounts transactions types
 * @returns {string}
 */
export const getCashflowAccountTransactionsTypes = () => {
  return Object.values(CASHFLOW_TRANSACTION_TYPE_META).map((meta) => meta.type);
};

/**
 * Tranasformes the given uncategorized transaction and categorized DTO
 * to cashflow create DTO.
 * @param {IUncategorizedCashflowTransaction} uncategorizeModel
 * @param {ICategorizeCashflowTransactioDTO} categorizeDTO
 * @returns {ICashflowNewCommandDTO}
 */
export const transformCategorizeTransToCashflow = (
  uncategorizeTransactions: Array<IUncategorizedCashflowTransaction>,
  categorizeDTO: ICategorizeCashflowTransactioDTO
): ICashflowNewCommandDTO => {
  const uncategorizeTransaction = first(uncategorizeTransactions);
  const amount = sumBy(uncategorizeTransactions, 'amount');
  const amountAbs = Math.abs(amount);

  return {
    date: categorizeDTO.date,
    referenceNo: categorizeDTO.referenceNo,
    description: categorizeDTO.description,
    cashflowAccountId: uncategorizeTransaction.accountId,
    creditAccountId: categorizeDTO.creditAccountId,
    exchangeRate: categorizeDTO.exchangeRate || 1,
    currencyCode: categorizeDTO.currencyCode,
    amount: amountAbs,
    transactionNumber: categorizeDTO.transactionNumber,
    transactionType: categorizeDTO.transactionType,
    branchId: categorizeDTO?.branchId,
    publish: true,
  };
};

export const validateUncategorizedTransactionsNotExcluded = (
  transactions: Array<UncategorizeCashflowTransaction>
) => {
  const excluded = transactions.filter((tran) => tran.excluded);

  if (excluded?.length > 0) {
    throw new ServiceError(ERRORS.CANNOT_CATEGORIZE_EXCLUDED_TRANSACTION, '', {
      ids: excluded.map((t) => t.id),
    });
  }
};


export const validateTransactionShouldBeCategorized = (
  uncategorizedTransaction: any
) => {
  if (!uncategorizedTransaction.categorized) {
    throw new ServiceError(ERRORS.TRANSACTION_NOT_CATEGORIZED);
  }
};
