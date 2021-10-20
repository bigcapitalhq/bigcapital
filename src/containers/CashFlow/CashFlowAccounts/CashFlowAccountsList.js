import React from 'react';

import 'style/pages/CashFlow/CashFlowAccounts/List.scss';

import { DashboardPageContent } from 'components';

import { CashFlowAccountsProvider } from './CashFlowAccountsProvider';

import CashFlowAccountsActionsBar from './CashFlowAccountsActionsBar';
import CashflowAccountsGrid from './CashflowAccountsGrid';

/**
 * Cash flow accounts list.
 */
function CashFlowAccountsList({}) {
  return (
    <CashFlowAccountsProvider>
      <CashFlowAccountsActionsBar />

      <DashboardPageContent>
        <CashflowAccountsGrid />
      </DashboardPageContent>
    </CashFlowAccountsProvider>
  );
}

export default CashFlowAccountsList;
