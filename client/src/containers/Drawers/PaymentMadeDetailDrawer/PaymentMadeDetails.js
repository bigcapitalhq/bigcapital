import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';

import PaymentMadeDetailTab from './PaymentMadeDetailTab';
import JournalEntriesTable from '../../JournalEntriesTable/JournalEntriesTable';
import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';

/**
 * payment made view detail.
 */
export default function PaymentMadeDetails() {
  const { transactions } = usePaymentMadeDetailContext();

  return (
    <div className="view-detail-drawer">
      <Tabs animate={true} large={true} defaultSelectedTabId="journal_entries">
        <Tab
          title={intl.get('details')}
          id={'details'}
          panel={<PaymentMadeDetailTab />}
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
