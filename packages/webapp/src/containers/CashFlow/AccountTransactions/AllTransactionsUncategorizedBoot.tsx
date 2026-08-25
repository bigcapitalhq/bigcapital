import React from 'react';
import { withBanking } from '../withBanking';
import { useAccountTransactionsContext } from './AccountTransactionsProvider';
import type { WithBankingProps } from '../withBanking';
import type { UncategorizedTransactionResponse } from '@bigcapital/sdk-ts';
import { IntersectionObserver } from '@/components';
import { useAccountUncategorizedTransactionsInfinity } from '@/hooks/query';
import { useFlattenInfinityPages } from '@/hooks/utils';
import { compose } from '@/utils';

export interface AccountUncategorizedTransactionsContextValue {
  uncategorizedTransactions: UncategorizedTransactionResponse[];
  isUncategorizedTransactionFetching: boolean;
  isUncategorizedTransactionsLoading: boolean;
}

interface AccountUncategorizedTransactionsBootRootProps
  extends Pick<WithBankingProps, 'uncategorizedTransactionsFilter'> {
  children?: React.ReactNode;
}

const AccountUncategorizedTransactionsContext =
  React.createContext<AccountUncategorizedTransactionsContextValue>(
    {} as AccountUncategorizedTransactionsContextValue,
  );

/**
 * Account un-categorized transactions provider.
 */
function AccountUncategorizedTransactionsBootRoot({
  // #withBanking
  uncategorizedTransactionsFilter,

  // #ownProps
  children,
}: AccountUncategorizedTransactionsBootRootProps) {
  const { accountId } = useAccountTransactionsContext();

  // Fetches the uncategorized transactions.
  const {
    data: uncategorizedTransactionsPage,
    isFetching: isUncategorizedTransactionFetching,
    isLoading: isUncategorizedTransactionsLoading,
    isSuccess: isUncategorizedTransactionsSuccess,
    hasNextPage: hasUncategorizedTransactionsNextPage,
    fetchNextPage: fetchNextUncategorizedTransactionsPage,
  } = useAccountUncategorizedTransactionsInfinity(accountId, {
    pageSize: 50,
    minDate: uncategorizedTransactionsFilter?.fromDate,
    maxDate: uncategorizedTransactionsFilter?.toDate,
  });
  // Memorized the cashflow account transactions.
  const uncategorizedTransactions = useFlattenInfinityPages(
    isUncategorizedTransactionsSuccess
      ? uncategorizedTransactionsPage
      : undefined,
    (page) => (page.data ?? []) as UncategorizedTransactionResponse[],
  );
  // Handle the observer inersection.
  const handleObserverInteract = React.useCallback(() => {
    if (
      !isUncategorizedTransactionFetching &&
      hasUncategorizedTransactionsNextPage
    ) {
      fetchNextUncategorizedTransactionsPage();
    }
  }, [
    isUncategorizedTransactionFetching,
    hasUncategorizedTransactionsNextPage,
    fetchNextUncategorizedTransactionsPage,
  ]);
  // Provider payload.
  const provider: AccountUncategorizedTransactionsContextValue = {
    uncategorizedTransactions: uncategorizedTransactions ?? [],
    isUncategorizedTransactionFetching,
    isUncategorizedTransactionsLoading,
  };

  return (
    <AccountUncategorizedTransactionsContext.Provider value={provider}>
      {children}
      <IntersectionObserver onIntersect={handleObserverInteract} />
    </AccountUncategorizedTransactionsContext.Provider>
  );
}

const AccountUncategorizedTransactionsBoot = compose(
  withBanking(({ uncategorizedTransactionsFilter }) => ({
    uncategorizedTransactionsFilter,
  })),
)(AccountUncategorizedTransactionsBootRoot);

const useAccountUncategorizedTransactionsContext = () =>
  React.useContext(AccountUncategorizedTransactionsContext);

export {
  AccountUncategorizedTransactionsBoot,
  useAccountUncategorizedTransactionsContext,
};
