import React, { useEffect } from 'react';
import { DashboardContentTable, DashboardPageContent } from 'components';

import 'style/pages/Bills/List.scss';

import { BillsListProvider } from './BillsListProvider';

import BillsActionsBar from './BillsActionsBar';
import BillsAlerts from './BillsAlerts';
import BillsViewsTabs from './BillsViewsTabs';
import BillsTable from './BillsTable';

import withBills from './withBills';
import withBillsActions from './withBillsActions';

import { transformTableStateToQuery, compose } from 'utils';

/**
 * Bills list.
 */
function BillsList({
  // #withBills
  billsTableState,
  billsTableStateChanged,

  // #withBillsActions
  setBillsTableState,
}) {
  // Resets the accounts table state once the page unmount.
  useEffect(
    () => () => {
      setBillsTableState({
        filterRoles: [],
        viewSlug: '',
        pageIndex: 0,
      });
    },
    [setBillsTableState],
  );

  return (
    <BillsListProvider
      query={transformTableStateToQuery(billsTableState)}
      tableStateChanged={billsTableStateChanged}
    >
      <BillsActionsBar />

      <DashboardPageContent>
        <BillsViewsTabs />
        <BillsTable />
      </DashboardPageContent>

      <BillsAlerts />
    </BillsListProvider>
  );
}

export default compose(
  withBills(({ billsTableState, billsTableStateChanged }) => ({
    billsTableState,
    billsTableStateChanged,
  })),
  withBillsActions,
)(BillsList);
