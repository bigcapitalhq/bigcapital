import React, { useEffect } from 'react';

import { useIntl } from 'react-intl';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import { BillsListProvider } from './BillsListProvider';

import BillsActionsBar from './BillsActionsBar';
import BillsAlerts from './BillsAlerts';
import BillsViewsTabs from './BillsViewsTabs';
import BillsTable from './BillsTable';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withBills from './withBills';

import { transformTableStateToQuery, compose } from 'utils';

/**
 * Bills list.
 */
function BillsList({
  // #withDashboardActions
  changePageTitle,

  // #withBills
  billsTableState,
}) {
  const { formatMessage } = useIntl();
  
  useEffect(() => {
    changePageTitle(formatMessage({ id: 'bills_list' }));
  }, [changePageTitle, formatMessage]);
  
  return (
    <BillsListProvider query={transformTableStateToQuery(billsTableState)}>
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
  withDashboardActions,
  withBills(({ billsTableState }) => ({ billsTableState })),
)(BillsList);
