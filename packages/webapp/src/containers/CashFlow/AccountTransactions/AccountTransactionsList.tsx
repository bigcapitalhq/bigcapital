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

/**
 * Account transactions list.
 */
function AccountTransactionsList() {
  return (
    <AccountTransactionsProvider>
      <AccountTransactionsActionsBar />
      <AccountTransactionsDetailsBar />
      <AccountTransactionsProgressBar />

      <DashboardPageContent>
        <AccountTransactionsFilterTabs />

        <Suspense fallback={<Spinner size={30} />}>
          <AccountTransactionsContent />
        </Suspense>
      </DashboardPageContent>
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
