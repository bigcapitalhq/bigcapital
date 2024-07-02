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
import { AccountTransactionsProgressBar } from './components';
import { AccountTransactionsFilterTabs } from './AccountTransactionsFilterTabs';
import { AppShell } from '@/components/AppShell/AppShell';
import { CategorizeTransactionAside } from '../CategorizeTransactionAside/CategorizeTransactionAside';
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
      <AppShell hideAside={!openMatchingTransactionAside}>
        <AppShell.Main>
          <AccountTransactionsActionsBar />
          <AccountTransactionsDetailsBar />
          <AccountTransactionsProgressBar />

          <DashboardPageContent>
            <AccountTransactionsFilterTabs />

            <Suspense fallback={<Spinner size={30} />}>
              <AccountTransactionsContent />
            </Suspense>
          </DashboardPageContent>
        </AppShell.Main>

        <AppShell.Aside>
          <CategorizeTransactionAside />
        </AppShell.Aside>
      </AppShell>
    </AccountTransactionsProvider>
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
