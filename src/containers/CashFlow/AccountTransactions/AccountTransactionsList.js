import React from 'react';

import 'style/pages/CashFlow/AccountTransactions/List.scss';

import { DashboardPageContent, DashboardContentTable } from 'components';

import { AccountTransactionsProvider } from './AccountTransactionsProvider';

import AccountTransactionsActionsBar from './AccountTransactionsActionsBar';
import AccountTransactionsDataTable from './AccountTransactionsDataTable';

/**
 * Account transactions list.
 */
function AccountTransactionsList() {
  return (
    <AccountTransactionsProvider>
      <AccountTransactionsActionsBar />
      <DashboardPageContent>
        <DashboardContentTable>
          <AccountTransactionsDataTable />
        </DashboardContentTable>
      </DashboardPageContent>
    </AccountTransactionsProvider>
  );
}

export default AccountTransactionsList;
