import { upperFirst, camelCase, omit } from 'lodash';
import {
  CASHFLOW_TRANSACTION_TYPE,
  CASHFLOW_TRANSACTION_TYPE_META,
  ICashflowTransactionTypeMeta,
} from './constants';
import {
  ICashflowNewCommandDTO,
  ICashflowTransaction,
  ICategorizeCashflowTransactioDTO,
  IUncategorizedCashflowTransaction,
} from '@/interfaces';

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
  return CASHFLOW_TRANSACTION_TYPE_META[transactionType];
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
  uncategorizeModel: IUncategorizedCashflowTransaction,
  categorizeDTO: ICategorizeCashflowTransactioDTO
): ICashflowNewCommandDTO => {
  return {
    date: uncategorizeModel.date,
    referenceNo: categorizeDTO.referenceNo || uncategorizeModel.referenceNo,
    description: categorizeDTO.description || uncategorizeModel.description,
    cashflowAccountId: uncategorizeModel.accountId,
    creditAccountId: categorizeDTO.creditAccountId,
    exchangeRate: categorizeDTO.exchangeRate || 1,
    currencyCode: uncategorizeModel.currencyCode,
    amount: uncategorizeModel.amount,
    transactionNumber: categorizeDTO.transactionNumber,
    transactionType: categorizeDTO.transactionType,
    uncategorizedTransactionId: uncategorizeModel.id,
    publish: true,
  };
};
