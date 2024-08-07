// @ts-nocheck
import React from 'react';
import { flatten, map } from 'lodash';
import { IntersectionObserver } from '@/components';
import { useAccountTransactionsContext } from '../AccountTransactionsProvider';
import { useRecognizedBankTransactionsInfinity } from '@/hooks/query/bank-rules';

interface RecognizedTransactionsContextValue {
  isRecongizedTransactionsLoading: boolean;
  isRecognizedTransactionsFetching: boolean;
  recognizedTransactions: Array<any>;
}

const RecognizedTransactionsContext =
  React.createContext<RecognizedTransactionsContextValue>(
    {} as RecognizedTransactionsContextValue,
  );

function flattenInfinityPagesData(data) {
  return flatten(map(data.pages, (page) => page.data));
}

interface RecognizedTransactionsTableBootProps {
  children: React.ReactNode;
}

/**
 * Account uncategorized transctions provider.
 */
function RecognizedTransactionsTableBoot({
  children,
}: RecognizedTransactionsTableBootProps) {
  const { accountId } = useAccountTransactionsContext();

  // Fetches the uncategorized transactions.
  const {
    data: recognizedTransactionsPage,
    isFetching: isRecognizedTransactionsFetching,
    isLoading: isRecongizedTransactionsLoading,
    isSuccess: isRecognizedTransactionsSuccess,
    isFetchingNextPage: isUncategorizedTransactionFetchNextPage,
    fetchNextPage: fetchNextrecognizedTransactionsPage,
    hasNextPage: hasUncategorizedTransactionsNextPage,
  } = useRecognizedBankTransactionsInfinity({
    page_size: 50,
    account_id: accountId,
  });
  // Memorized the cashflow account transactions.
  const recognizedTransactions = React.useMemo(
    () =>
      isRecognizedTransactionsSuccess
        ? flattenInfinityPagesData(recognizedTransactionsPage)
        : [],
    [recognizedTransactionsPage, isRecognizedTransactionsSuccess],
  );
  // Handle the observer ineraction.
  const handleObserverInteract = React.useCallback(() => {
    if (
      !isRecognizedTransactionsFetching &&
      hasUncategorizedTransactionsNextPage
    ) {
      fetchNextrecognizedTransactionsPage();
    }
  }, [
    isRecognizedTransactionsFetching,
    hasUncategorizedTransactionsNextPage,
    fetchNextrecognizedTransactionsPage,
  ]);
  // Provider payload.
  const provider = {
    recognizedTransactions,
    isRecognizedTransactionsFetching,
    isRecongizedTransactionsLoading,
  };

  return (
    <RecognizedTransactionsContext.Provider value={provider}>
      {children}
      <IntersectionObserver
        onIntersect={handleObserverInteract}
        enabled={!isUncategorizedTransactionFetchNextPage}
      />
    </RecognizedTransactionsContext.Provider>
  );
}

const useRecognizedTransactionsBoot = () =>
  React.useContext(RecognizedTransactionsContext);

export { RecognizedTransactionsTableBoot, useRecognizedTransactionsBoot };
