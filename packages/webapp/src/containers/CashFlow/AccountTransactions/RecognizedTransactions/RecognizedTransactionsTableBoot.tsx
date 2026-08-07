import React from 'react';
import { withBanking } from '../../withBanking';
import { useAccountTransactionsContext } from '../AccountTransactionsProvider';
import type { RecognizedTransactionRow } from './_utils';
import type { WithBankingProps } from '../../withBanking';
import type { BankTransactionsListPage } from '@bigcapital/sdk-ts';
import { IntersectionObserver } from '@/components';
import { useRecognizedBankTransactionsInfinity } from '@/hooks/query/banking';
import { useFlattenInfinityPages } from '@/hooks/utils';
import { compose } from '@/utils';

export interface RecognizedTransactionsContextValue {
  recognizedTransactions: RecognizedTransactionRow[];
  isRecognizedTransactionsLoading: boolean;
  isRecognizedTransactionsFetching: boolean;
}

interface RecognizedTransactionsTableBootProps
  extends Pick<WithBankingProps, 'uncategorizedTransactionsFilter'> {
  children: React.ReactNode;
}

const RecognizedTransactionsContext =
  React.createContext<RecognizedTransactionsContextValue>(
    {} as RecognizedTransactionsContextValue,
  );

/**
 * Account recognized transactions provider.
 */
function RecognizedTransactionsTableBootRoot({
  // #withBanking
  uncategorizedTransactionsFilter,

  children,
}: RecognizedTransactionsTableBootProps) {
  const { accountId } = useAccountTransactionsContext();

  // Fetches the recognized transactions.
  const {
    data: recognizedTransactionsPage,
    isFetching: isRecognizedTransactionsFetching,
    isLoading: isRecognizedTransactionsLoading,
    isSuccess: isRecognizedTransactionsSuccess,
    hasNextPage: hasRecognizedTransactionsNextPage,
    fetchNextPage: fetchNextRecognizedTransactionsPage,
  } = useRecognizedBankTransactionsInfinity({
    pageSize: 50,
    accountId,
    minDate: uncategorizedTransactionsFilter?.fromDate || undefined,
    maxDate: uncategorizedTransactionsFilter?.toDate || undefined,
  });
  // Memorized the recognized transactions.
  const recognizedTransactions = useFlattenInfinityPages<
    BankTransactionsListPage,
    RecognizedTransactionRow
  >(
    isRecognizedTransactionsSuccess ? recognizedTransactionsPage : undefined,
    (page) => (page?.data ?? []) as RecognizedTransactionRow[],
  );
  // Handle the observer ineraction.
  const handleObserverInteract = React.useCallback(() => {
    if (
      !isRecognizedTransactionsFetching &&
      hasRecognizedTransactionsNextPage
    ) {
      fetchNextRecognizedTransactionsPage();
    }
  }, [
    isRecognizedTransactionsFetching,
    hasRecognizedTransactionsNextPage,
    fetchNextRecognizedTransactionsPage,
  ]);
  // Provider payload.
  const provider: RecognizedTransactionsContextValue = {
    recognizedTransactions: recognizedTransactions ?? [],
    isRecognizedTransactionsFetching,
    isRecognizedTransactionsLoading,
  };

  return (
    <RecognizedTransactionsContext.Provider value={provider}>
      {children}
      <IntersectionObserver onIntersect={handleObserverInteract} />
    </RecognizedTransactionsContext.Provider>
  );
}

const RecognizedTransactionsTableBoot = compose(
  withBanking(({ uncategorizedTransactionsFilter }) => ({
    uncategorizedTransactionsFilter,
  })),
)(RecognizedTransactionsTableBootRoot);

const useRecognizedTransactionsBoot = () =>
  React.useContext(RecognizedTransactionsContext);

export { RecognizedTransactionsTableBoot, useRecognizedTransactionsBoot };
