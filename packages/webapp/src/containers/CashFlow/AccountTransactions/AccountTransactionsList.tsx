// @ts-nocheck
import React, { Suspense } from 'react';
import * as R from 'ramda';
import { Spinner } from '@blueprintjs/core';

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
import { CategorizeTransactionAside } from '../CategorizeTransactionAside/CategorizeTransactionAside';
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

function AccountTransactionsAside() {
  return (
    <AppContentShell.Aside>
      <CategorizeTransactionAside />
    </AppContentShell.Aside>
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

const AccountsTransactionsAll = React.lazy(
  () => import('./AccountsTransactionsAll'),
);

const AccountsTransactionsUncategorized = React.lazy(
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
