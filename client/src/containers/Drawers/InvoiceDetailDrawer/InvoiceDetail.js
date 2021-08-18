import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';

import JournalEntriesTable from '../../JournalEntriesTable/JournalEntriesTable';
import InvoiceDetailTab from './InvoiceDetailTab';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

/**
 * Invoice view detail.
 */
export default function InvoiceDetail() {
  const { transactions, invoiceId } = useInvoiceDetailDrawerContext();

  return (
    <div className="view-detail-drawer">
      <Tabs
        animate={true}
        large={true}
        defaultSelectedTabId="journal_entries"
        renderActiveTabPanelOnly={false}
      >
        <Tab
          title={intl.get('details')}
          id={'details'}
          panel={<InvoiceDetailTab invoiceId={invoiceId} />}
        />
        <Tab
          title={intl.get('journal_entries')}
          id={'journal_entries'}
          panel={<JournalEntriesTable transactions={transactions} />}
        />
      </Tabs>
    </div>
  );
}
