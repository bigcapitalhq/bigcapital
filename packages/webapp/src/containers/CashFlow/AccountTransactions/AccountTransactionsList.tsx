// @ts-nocheck
import * as R from 'ramda';
import { Spinner } from '@blueprintjs/core';
import { Suspense, lazy } from 'react';

import '@/style/pages/CashFlow/AccountTransactions/List.scss';

import { DashboardPageContent } from '@/components';

import AccountTransactionsActionsBar from './AccountTransactionsActionsBar';
import {
  AccountTransactionsProvider,
  useAccountTransactionsContext,
} from './AccountTransactionsProvider';
import { AccountTransactionsDetailsBar } from './AccountTransactionsDetailsBar';
import { AccountTransactionsFilterTabs } from './AccountTransactionsFilterTabs';
import { AppContentShell } from '@/components/AppShell';
import { AccountTransactionsAside } from './AccountTransactionsAside';
import { AccountTransactionsLoadingBar } from './components';
import { withBanking } from '../withBanking';

/**
 * Account transactions list.
 */
function AccountTransactionsListRoot({
  // #withBanking
  openMatchingTransactionAside,
}) {
  return (
    <AccountTransactionsProvider>
      <AppContentShell hideAside={!openMatchingTransactionAside}>
        <AccountTransactionsMain />
        <AccountTransactionsAside />
      </AppContentShell>
    </AccountTransactionsProvider>
  );
}

function AccountTransactionsMain() {
  const { setScrollableRef } = useAccountTransactionsContext();

  return (
    <AppContentShell.Main ref={(e) => setScrollableRef(e)}>
      <AccountTransactionsActionsBar />
      <AccountTransactionsLoadingBar />
      <AccountTransactionsDetailsBar />

      <DashboardPageContent>
        <AccountTransactionsFilterTabs />

        <Suspense fallback={<Spinner size={30} />}>
          <AccountTransactionsContent />
        </Suspense>
      </DashboardPageContent>
    </AppContentShell.Main>
  );
}

export default R.compose(
  withBanking(
    ({ selectedUncategorizedTransactionId, openMatchingTransactionAside }) => ({
      selectedUncategorizedTransactionId,
      openMatchingTransactionAside,
    }),
  ),
)(AccountTransactionsListRoot);

const AccountsTransactionsAll = lazy(() => import('./AccountsTransactionsAll'));
const AccountsTransactionsUncategorized = lazy(
  () => import('./AllTransactionsUncategorized'),
);

function AccountTransactionsContent() {
  const { filterTab } = useAccountTransactionsContext();

  return filterTab === 'uncategorized' ? (
    <AccountsTransactionsUncategorized />
  ) : (
    <AccountsTransactionsAll />
  );
}
