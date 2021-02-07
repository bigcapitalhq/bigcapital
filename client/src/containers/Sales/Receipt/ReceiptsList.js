import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';

import ReceiptActionsBar from './ReceiptActionsBar';
import ReceiptsViewPage from './ReceiptsViewPage';
import ReceiptsAlerts from './ReceiptsAlerts';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withReceipts from './withReceipts';

import { ReceiptsListProvider } from './ReceiptsListProvider';

import { compose } from 'utils';

/**
 * Receipts list page.
 */
function ReceiptsList({
  // #withDashboardActions
  changePageTitle,

  // #withReceipts
  receiptTableQuery,
}) {
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'receipts_list' }));
  }, [changePageTitle, formatMessage]);

  return (
    <ReceiptsListProvider query={receiptTableQuery}>
      <DashboardPageContent>
        <ReceiptActionsBar />

        <ReceiptsViewPage />
        <ReceiptsAlerts />
      </DashboardPageContent>
    </ReceiptsListProvider>
  );
}

export default compose(
  withDashboardActions,
  withReceipts(({ receiptTableQuery }) => ({
    receiptTableQuery,
  })),
)(ReceiptsList);
