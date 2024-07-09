import { isObject, upperFirst, camelCase } from 'lodash';
import {
  TransactionTypes,
  CashflowTransactionTypes,
} from '@/data/TransactionTypes';

/**
 * Retrieves the formatted type of account transaction.
 * @param {string} referenceType
 * @param {string} transactionType
 * @returns {string}
 */
export const getTransactionTypeLabel = (
  referenceType: string,
  transactionType?: string
) => {
  const _referenceType = upperFirst(camelCase(referenceType));
  const _transactionType = upperFirst(camelCase(transactionType));

  return isObject(TransactionTypes[_referenceType])
    ? TransactionTypes[_referenceType][_transactionType]
    : TransactionTypes[_referenceType] || null;
};

/**
 * Retrieves the formatted type of cashflow transaction.
 * @param {string} transactionType
 * @returns {string¿}
 */
export const getCashflowTransactionFormattedType = (
  transactionType: string
) => {
  const _transactionType = upperFirst(camelCase(transactionType));

  return CashflowTransactionTypes[_transactionType] || null;
};
