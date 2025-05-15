import * as R from 'ramda';

export const groupUncategorizedTransactions = (
  uncategorizedTransactions: any,
): Map<string, any> => {
  return new Map(
    R.toPairs(
      R.groupBy(
        (transaction: any) =>
          `${transaction.categorizeRefType}-${transaction.categorizeRefId}`,
        uncategorizedTransactions,
      ),
    ),
  );
};

export const groupMatchedBankTransactions = (
  uncategorizedTransactions: any,
): Map<string, any> => {
  return new Map(
    R.toPairs(
      R.groupBy(
        (transaction: any) =>
          `${transaction.referenceType}-${transaction.referenceId}`,
        uncategorizedTransactions,
      ),
    ),
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

export const getBankAccountTransactionsDefaultQuery = () => {
  return {
    pageSize: 50,
    page: 1,
    numberFormat: {
      precision: 2,
      divideOn1000: false,
      showZero: false,
      formatMoney: 'total',
      negativeFormat: 'mines',
    },
  };
};
