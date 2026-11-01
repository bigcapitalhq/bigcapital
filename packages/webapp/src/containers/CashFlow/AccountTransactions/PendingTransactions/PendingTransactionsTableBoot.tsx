import React from 'react';
import { useAccountTransactionsContext } from '../AccountTransactionsProvider';
import type { PendingBankTransactionsListPage } from '@bigcapital/sdk-ts';
import { IntersectionObserver } from '@/components';
import { usePendingBankTransactionsInfinity } from '@/hooks/query/banking';
import { useFlattenInfinityPages } from '@/hooks/utils';

type PendingTransactionRow = NonNullable<
  PendingBankTransactionsListPage['data']
>[number];

export interface PendingTransactionsContextValue {
  pendingTransactions: PendingTransactionRow[];
  isPendingTransactionFetching: boolean;
  isPendingTransactionsLoading: boolean;
}

interface PendingTransactionsBootProps {
  children: React.ReactNode;
}

const PendingTransactionsContext =
  React.createContext<PendingTransactionsContextValue>(
    {} as PendingTransactionsContextValue,
  );

/**
 * Account pending transctions provider.
 */
function PendingTransactionsBoot({ children }: PendingTransactionsBootProps) {
  const { accountId } = useAccountTransactionsContext();

  // Fetches the pending transactions.
  const {
    data: pendingTransactionsPage,
    isFetching: isPendingTransactionFetching,
    isLoading: isPendingTransactionsLoading,
    isSuccess: isPendingTransactionsSuccess,
    hasNextPage: hasPendingTransactionsNextPage,
    fetchNextPage: fetchNextPendingTransactionsPage,
  } = usePendingBankTransactionsInfinity({
    accountId,
    pageSize: 50,
  });
  // Memorized the cashflow account transactions.
  const pendingTransactions = useFlattenInfinityPages(
    isPendingTransactionsSuccess ? pendingTransactionsPage : undefined,
    (page) => page?.data ?? [],
  );
  // Handle the observer ineraction.
  const handleObserverInteract = React.useCallback(() => {
    if (!isPendingTransactionFetching && hasPendingTransactionsNextPage) {
      fetchNextPendingTransactionsPage();
    }
  }, [
    isPendingTransactionFetching,
    hasPendingTransactionsNextPage,
    fetchNextPendingTransactionsPage,
  ]);
  // Provider payload.
  const provider: PendingTransactionsContextValue = {
    pendingTransactions: pendingTransactions ?? [],
    isPendingTransactionFetching,
    isPendingTransactionsLoading,
  };

  return (
    <PendingTransactionsContext.Provider value={provider}>
      {children}
      <IntersectionObserver onIntersect={handleObserverInteract} />
    </PendingTransactionsContext.Provider>
  );
}

const usePendingTransactionsContext = () =>
  React.useContext(PendingTransactionsContext);

export { PendingTransactionsBoot, usePendingTransactionsContext };
