import React from 'react';
import { Tab } from '@blueprintjs/core';
import styled from 'styled-components';

import { DrawerMainTabs } from 'components';

import InvoiceDetailActionsBar from './InvoiceDetailActionsBar';
import InvoiceGLEntriesTable from './InvoiceGLEntriesTable';
import InvoicePaymentTransactionsTable from './InvoicePaymentTransactions/InvoicePaymentTransactionsTable';
import InvoiceDetailTab from './InvoiceDetailTab';

/**
 * Invoice details tabs.
 * @returns {React.JSX}
 */
function InvoiceDetailsTabs() {
  return (
    <DrawerMainTabs
      renderActiveTabPanelOnly={true}
      defaultSelectedTabId="details"
    >
      <Tab title={'Overview'} id={'details'} panel={<InvoiceDetailTab />} />
      <Tab
        title={'Journal Entries'}
        id={'journal_entries'}
        panel={<InvoiceGLEntriesTable />}
      />
      <Tab
        title={'Payment Transactions'}
        id={'payment_transactions'}
        panel={<InvoicePaymentTransactionsTable />}
      />
    </DrawerMainTabs>
  );
}

/**
 * Invoice view detail.
 * @returns {React.JSX}
 */
export default function InvoiceDetail() {
  return (
    <InvoiceDetailsRoot>
      <InvoiceDetailActionsBar />
      <InvoiceDetailsTabs />
    </InvoiceDetailsRoot>
  );
}

export const InvoiceDetailsRoot = styled.div``;
