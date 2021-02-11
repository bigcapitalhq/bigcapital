import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import ReceiptActionsBar from './ReceiptActionsBar';
import ReceiptViewTabs from './ReceiptViewTabs';
import ReceiptsAlerts from '../ReceiptsAlerts';
import ReceiptsTable from './ReceiptsTable';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withReceipts from './withReceipts';

import { ReceiptsListProvider } from './ReceiptsListProvider';

import { transformTableStateToQuery, compose } from 'utils';

/**
 * Receipts list page.
 */
function ReceiptsList({
  // #withDashboardActions
  changePageTitle,

  // #withReceipts
  receiptTableState,
}) {
  const { formatMessage } = useIntl();

  // Changes the dashboard page title once the page mount.
  useEffect(() => {
    changePageTitle(formatMessage({ id: 'receipts_list' }));
  }, [changePageTitle, formatMessage]);

  return (
    <ReceiptsListProvider query={transformTableStateToQuery(receiptTableState)}>
      <DashboardPageContent>
        <ReceiptActionsBar />

        <DashboardPageContent>
          <ReceiptViewTabs />
          <ReceiptsTable />
        </DashboardPageContent>

        <ReceiptsAlerts />
      </DashboardPageContent>
    </ReceiptsListProvider>
  );
}

export default compose(
  withDashboardActions,
  withReceipts(({ receiptTableState }) => ({
    receiptTableState,
  })),
)(ReceiptsList);
