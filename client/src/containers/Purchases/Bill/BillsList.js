import React, { useEffect } from 'react';

import { useIntl } from 'react-intl';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import { BillsListProvider } from './BillsListProvider';
import BillsDataTable from './BillsDataTable';
import BillsActionsBar from './BillsActionsBar';
import BillsAlerts from './BillsAlerts';
import BillsViewPage from './BillsViewPage';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withBills from './withBills';

import { compose } from 'utils';

/**
 * Bills list.
 */
function BillsList({
  // #withDashboardActions
  changePageTitle,

  // #withBills
  billsTableQuery,
}) {
  const { formatMessage } = useIntl();
  
  useEffect(() => {
    changePageTitle(formatMessage({ id: 'bills_list' }));
  }, [changePageTitle, formatMessage]);
  
  return (
    <BillsListProvider query={billsTableQuery}>
      <BillsActionsBar />

      <DashboardPageContent>
        <BillsViewPage />
        <BillsAlerts />
      </DashboardPageContent>
    </BillsListProvider>
  );
}

export default compose(
  withDashboardActions,
  withBills(({ billsTableQuery }) => ({
    billsTableQuery,
  })),
)(BillsList);
