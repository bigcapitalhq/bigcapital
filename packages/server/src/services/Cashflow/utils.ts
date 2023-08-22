import { upperFirst, camelCase } from 'lodash';
import {
  CASHFLOW_TRANSACTION_TYPE,
  CASHFLOW_TRANSACTION_TYPE_META,
  ICashflowTransactionTypeMeta,
} from './constants';

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
