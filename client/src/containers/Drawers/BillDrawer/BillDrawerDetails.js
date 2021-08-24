import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';

import BillDetailTab from './BillDetailTab';
import LocatedLandedCostTable from './LocatedLandedCostTable';
import JournalEntriesTable from '../../JournalEntriesTable/JournalEntriesTable';
import { useBillDrawerContext } from './BillDrawerProvider';

/**
 * Bill view details.
 */
export default function BillDrawerDetails() {
  const {
    data: { transactions },
  } = useBillDrawerContext();

  return (
    <div className="view-detail-drawer">
      <Tabs animate={true} large={true} defaultSelectedTabId="journal_entries">
        <Tab
          title={intl.get('details')}
          id={'details'}
          panel={<BillDetailTab />}
        />
        <Tab
          title={intl.get('journal_entries')}
          id={'journal_entries'}
          panel={<JournalEntriesTable transactions={transactions} />}
        />
        <Tab
          title={intl.get('located_landed_cost')}
          id={'landed_cost'}
          panel={<LocatedLandedCostTable />}
        />
      </Tabs>
    </div>
  );
}
