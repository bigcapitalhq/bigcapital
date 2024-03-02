// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import '@/style/pages/CashFlow/AccountTransactions/List.scss';

import { DashboardPageContent } from '@/components';

import AccountTransactionsActionsBar from './AccountTransactionsActionsBar';
import AccountTransactionsDataTable from './AccountTransactionsDataTable';
import { AccountTransactionsProvider } from './AccountTransactionsProvider';
import { AccountTransactionsDetailsBar } from './AccountTransactionsDetailsBar';
import { AccountTransactionsProgressBar } from './components';
import { AccountTransactionsFilterTabs } from './AccountTransactionsFilterTabs';
import { AccountTransactionsUncategorizeFilter } from './AccountTransactionsUncategorizeFilter';

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

        <Box>
          <AccountTransactionsUncategorizeFilter />

          <CashflowTransactionsTableCard>
            <AccountTransactionsDataTable />
          </CashflowTransactionsTableCard>
        </Box>
      </DashboardPageContent>
    </AccountTransactionsProvider>
  );
}

export default AccountTransactionsList;

const CashflowTransactionsTableCard = styled.div`
  border: 2px solid #f0f0f0;
  border-radius: 10px;
  padding: 30px 18px;
  background: #fff;
  flex: 0 1;
`;

const Box = styled.div`
  margin: 30px 15px;
`;
