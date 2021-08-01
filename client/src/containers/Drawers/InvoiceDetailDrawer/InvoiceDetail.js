import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';

import JournalEntriesTable from '../../JournalEntriesTable/JournalEntriesTable';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

/**
 * Invoice view detail.
 */
export default function InvoiceDetail() {
  const { data } = useInvoiceDetailDrawerContext();

  return (
    <div className="view-detail-drawer">
      <Tabs
        animate={true}
        large={true}
        defaultSelectedTabId="journal_entries"
        renderActiveTabPanelOnly={false}
      >
        <Tab title={intl.get('details')} disabled={true} />
        <Tab
          title={intl.get('journal_entries')}
          id={'journal_entries'}
          panel={<JournalEntriesTable transactions={data} />}
        />
      </Tabs>
    </div>
  );
}
