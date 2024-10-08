// @ts-nocheck
import React from 'react';
import { flatten, map } from 'lodash';
import * as R from 'ramda';
import { IntersectionObserver } from '@/components';
import { useAccountTransactionsContext } from '../AccountTransactionsProvider';
import { useExcludedBankTransactionsInfinity } from '@/hooks/query/bank-rules';
import { withBanking } from '../../withBanking';

interface ExcludedBankTransactionsContextValue {
  isExcludedTransactionsLoading: boolean;
  isExcludedTransactionsFetching: boolean;
  excludedBankTransactions: Array<any>;
}

const ExcludedTransactionsContext =
  React.createContext<ExcludedBankTransactionsContextValue>(
    {} as ExcludedBankTransactionsContextValue,
  );

function flattenInfinityPagesData(data) {
  return flatten(map(data.pages, (page) => page.data));
}

interface ExcludedBankTransactionsTableBootProps {
  children: React.ReactNode;
}

/**
 * Account uncategorized transctions provider.
 */
function ExcludedBankTransactionsTableBootRoot({
  // #withBanking
  uncategorizedTransactionsFilter,

  // #ownProps
  children,
}: ExcludedBankTransactionsTableBootProps) {
  const { accountId } = useAccountTransactionsContext();

  // Fetches the uncategorized transactions.
  const {
    data: recognizedTransactionsPage,
    isFetching: isExcludedTransactionsFetching,
    isLoading: isExcludedTransactionsLoading,
    isSuccess: isRecognizedTransactionsSuccess,
    isFetchingNextPage: isUncategorizedTransactionFetchNextPage,
    fetchNextPage: fetchNextrecognizedTransactionsPage,
    hasNextPage: hasUncategorizedTransactionsNextPage,
  } = useExcludedBankTransactionsInfinity({
    page_size: 50,
    account_id: accountId,
    min_date: uncategorizedTransactionsFilter?.fromDate || null,
    max_date: uncategorizedTransactionsFilter.toDate || null,
  });
  // Memorized the cashflow account transactions.
  const excludedBankTransactions = React.useMemo(
    () =>
      isRecognizedTransactionsSuccess
        ? flattenInfinityPagesData(recognizedTransactionsPage)
        : [],
    [recognizedTransactionsPage, isRecognizedTransactionsSuccess],
  );
  // Handle the observer ineraction.
  const handleObserverInteract = React.useCallback(() => {
    if (
      !isExcludedTransactionsFetching &&
      hasUncategorizedTransactionsNextPage
    ) {
      fetchNextrecognizedTransactionsPage();
    }
  }, [
    isExcludedTransactionsFetching,
    hasUncategorizedTransactionsNextPage,
    fetchNextrecognizedTransactionsPage,
  ]);
  // Provider payload.
  const provider = {
    excludedBankTransactions,
    isExcludedTransactionsFetching,
    isExcludedTransactionsLoading,
  };

  return (
    <ExcludedTransactionsContext.Provider value={provider}>
      {children}
      <IntersectionObserver
        onIntersect={handleObserverInteract}
        enabled={!isUncategorizedTransactionFetchNextPage}
      />
    </ExcludedTransactionsContext.Provider>
  );
}

const ExcludedBankTransactionsTableBoot = R.compose(
  withBanking(({ uncategorizedTransactionsFilter }) => ({
    uncategorizedTransactionsFilter,
  })),
)(ExcludedBankTransactionsTableBootRoot);

const useExcludedTransactionsBoot = () =>
  React.useContext(ExcludedTransactionsContext);

export { ExcludedBankTransactionsTableBoot, useExcludedTransactionsBoot };
