import React from 'react';

import 'style/pages/CashFlow/CashFlowAccounts/List.scss';

import { DashboardPageContent, DashboardContentTable } from 'components';

import { CashFlowAccountsProvider } from './CashFlowAccountsProvider';

import CashFlowAccountsActionsBar from './CashFlowAccountsActionsBar';
import CashFlowAccountsDataTable from './CashFlowAccountsDataTable';

/**
 * Cash flow accounts list.
 */
function CashFlowAccountsList({}) {
  return (
    <CashFlowAccountsProvider>
      <CashFlowAccountsActionsBar />
      <DashboardPageContent>
        <DashboardContentTable>
          <CashFlowAccountsDataTable />
        </DashboardContentTable>
      </DashboardPageContent>
    </CashFlowAccountsProvider>
  );
}

export default CashFlowAccountsList;
