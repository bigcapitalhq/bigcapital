import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';

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
      <Tabs animate={true} large={true} defaultSelectedTabId="landed_cost">
        <Tab title={intl.get('details')} id={'details'} disabled={true} />
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
