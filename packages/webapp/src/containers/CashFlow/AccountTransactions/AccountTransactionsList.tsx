// @ts-nocheck
import React, { Suspense } from 'react';
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

/**
 * Account transactions list.
 */
function AccountTransactionsList() {
  return (
    <AccountTransactionsProvider>
      <AppShell>
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

export default AccountTransactionsList;

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
