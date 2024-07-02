// @ts-nocheck
import t from '@/store/types';

/**
 * Sets global table state of the table.
 * @param {object} queries
 */
export const setUncategorizedTransactionIdForMatching = (
  uncategorizedTransactionId: number,
) => {
  return {
    type: 'setUncategorizedTransactionIdForMatching',
    payload: uncategorizedTransactionId,
  };
};

export const closeMatchingTransactionAside = () => {
  return {
    type: 'closeMatchingTransactionAside',
  };
};
