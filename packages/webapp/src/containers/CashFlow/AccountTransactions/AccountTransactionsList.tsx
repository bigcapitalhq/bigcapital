import { Spinner } from '@blueprintjs/core';
import React, { Suspense, lazy } from 'react';

import '@/style/pages/CashFlow/AccountTransactions/List.scss';
import { withBanking } from '../withBanking';
import { AccountTransactionsActionsBar } from './AccountTransactionsActionsBar';
import { AccountTransactionsAside } from './AccountTransactionsAside';
import { AccountTransactionsDetailsBar } from './AccountTransactionsDetailsBar';
import { AccountTransactionsFilterTabs } from './AccountTransactionsFilterTabs';
import {
  AccountTransactionsProvider,
  useAccountTransactionsContext,
} from './AccountTransactionsProvider';
import { AccountTransactionsLoadingBar } from './components';
import type { WithBankingProps } from '../withBanking';
import { DashboardPageContent } from '@/components';
import { AppContentShell } from '@/components/AppShell';
import { CashFlowDrawers } from '@/containers/CashFlow/CashFlowDrawers';
import { compose } from '@/utils';

interface AccountTransactionsListRootProps
  extends Pick<WithBankingProps, 'openMatchingTransactionAside'> {}

/**
 * Account transactions list.
 */
function AccountTransactionsListRoot({
  // #withBanking
  openMatchingTransactionAside,
}: AccountTransactionsListRootProps) {
  return (
    <AccountTransactionsProvider>
      <CashFlowDrawers />

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
    <AppContentShell.Main
      ref={(e: HTMLDivElement | null) => setScrollableRef(e)}
    >
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

export const AccountTransactionsList = compose(
  withBanking(
    ({ selectedUncategorizedTransactionId, openMatchingTransactionAside }) => ({
      selectedUncategorizedTransactionId,
      openMatchingTransactionAside,
    }),
  ),
)(AccountTransactionsListRoot);

const AccountsTransactionsAll = lazy(() =>
  import('./AccountsTransactionsAll').then((m) => ({
    default: m.AccountTransactionsAll,
  })),
);
const AccountsTransactionsUncategorized = lazy(() =>
  import('./AllTransactionsUncategorized').then((m) => ({
    default: m.AllTransactionsUncategorized,
  })),
);

function AccountTransactionsContent() {
  const { filterTab } = useAccountTransactionsContext();

  return filterTab === 'uncategorized' ? (
    <AccountsTransactionsUncategorized />
  ) : (
    <AccountsTransactionsAll />
  );
}
