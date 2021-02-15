import React from 'react';
import { DashboardContentTable, DashboardPageContent } from 'components';

import { BillsListProvider } from './BillsListProvider';

import BillsActionsBar from './BillsActionsBar';
import BillsAlerts from './BillsAlerts';
import BillsViewsTabs from './BillsViewsTabs';
import BillsTable from './BillsTable';

import withBills from './withBills';

import { transformTableStateToQuery, compose } from 'utils';

/**
 * Bills list.
 */
function BillsList({
  // #withBills
  billsTableState,
}) {
  return (
    <BillsListProvider query={transformTableStateToQuery(billsTableState)}>
      <BillsActionsBar />

      <DashboardPageContent>
        <BillsViewsTabs />

        <DashboardContentTable>
          <BillsTable />
        </DashboardContentTable>
      </DashboardPageContent>

      <BillsAlerts />
    </BillsListProvider>
  );
}

export default compose(
  withBills(({ billsTableState }) => ({ billsTableState })),
)(BillsList);
