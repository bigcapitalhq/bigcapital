import * as R from 'ramda';

export const groupUncategorizedTransactions = (
  uncategorizedTransactions: any
): Map<string, any> => {
  return new Map(
    R.toPairs(
      R.groupBy(
        (transaction) =>
          `${transaction.categorizeRefType}-${transaction.categorizeRefId}`,
        uncategorizedTransactions
      )
    )
  );
};

export const groupMatchedBankTransactions = (
  uncategorizedTransactions: any
): Map<string, any> => {
  return new Map(
    R.toPairs(
      R.groupBy(
        (transaction) =>
          `${transaction.referenceType}-${transaction.referenceId}`,
        uncategorizedTransactions
      )
    )
  );
};

export const formatBankTransactionsStatus = (status) => {
  switch (status) {
    case 'categorized':
      return 'Categorized';
    case 'matched':
      return 'Matched';
    case 'manual':
      return 'Manual';
  }
};
