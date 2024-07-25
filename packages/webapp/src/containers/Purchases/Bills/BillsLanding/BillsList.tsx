// @ts-nocheck
import React, { useEffect } from 'react';
import { DashboardPageContent } from '@/components';

import '@/style/pages/Bills/List.scss';

import { BillsListProvider } from './BillsListProvider';

import BillsActionsBar from './BillsActionsBar';
import BillsTable from './BillsTable';

import withBills from './withBills';
import withBillsActions from './withBillsActions';

import { transformTableStateToQuery, compose } from '@/utils';

/**
 * Bills list.
 */
function BillsList({
  // #withBills
  billsTableState,
  billsTableStateChanged,

  // #withBillsActions
  resetBillsTableState,
}) {
  // Resets the accounts table state once the page unmount.
  useEffect(
    () => () => {
      resetBillsTableState();
    },
    [resetBillsTableState],
  );

  return (
    <BillsListProvider
      query={transformTableStateToQuery(billsTableState)}
      tableStateChanged={billsTableStateChanged}
    >
      <BillsActionsBar />

      <DashboardPageContent>
        <BillsTable />
      </DashboardPageContent>
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
