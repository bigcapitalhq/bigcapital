import React, { useEffect } from 'react';
import { compose } from 'lodash/fp';

import '@/style/pages/CashFlow/CashFlowAccounts/List.scss';

import { DashboardPageContent } from '@/components';
import { CashFlowAccountsProvider } from './CashFlowAccountsProvider';

import CashflowAccountsGrid from './CashflowAccountsGrid';
import CashFlowAccountsActionsBar from './CashFlowAccountsActionsBar';

import withCashflowAccounts from '@/containers/CashFlow/AccountTransactions/withCashflowAccounts';
import withCashflowAccountsTableActions from '@/containers/CashFlow/AccountTransactions/withCashflowAccountsTableActions';

/**
 * Cashflow accounts list.
 */
function CashFlowAccountsList({
  // #withCashflowAccounts
  cashflowAccountsTableState,

  // #withCashflowAccountsTableActions
  resetCashflowAccountsTableState,
}) {
  // Resets the cashflow accounts table state.
  useEffect(
    () => () => {
      resetCashflowAccountsTableState();
    },
    [resetCashflowAccountsTableState],
  );

  return (
    <CashFlowAccountsProvider tableState={cashflowAccountsTableState}>
      <CashFlowAccountsActionsBar />

      <DashboardPageContent>
        <CashflowAccountsGrid />
      </DashboardPageContent>
    </CashFlowAccountsProvider>
  );
}

export default compose(
  withCashflowAccounts(({ cashflowAccountsTableState }) => ({
    cashflowAccountsTableState,
  })),
  withCashflowAccountsTableActions,
)(CashFlowAccountsList);
