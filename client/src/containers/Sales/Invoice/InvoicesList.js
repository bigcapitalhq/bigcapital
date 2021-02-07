import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import 'style/pages/SaleInvoice/List.scss';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import InvoiceActionsBar from './InvoiceActionsBar';
import { InvoicesListProvider } from './InvoicesListProvider';

import InvoicesViewPage from './InvoicesViewPage';
import InvoicesAlerts from './InvoicesAlerts';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withInvoices from './withInvoices';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Sale invoices list.
 */
function InvoicesList({
  // #withDashboardActions
  changePageTitle,

  // #withInvoice
  invoicesTableQuery,
}) {
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'invoices_list' }));
  }, [changePageTitle, formatMessage]);

  return (
    <InvoicesListProvider query={invoicesTableQuery}>
      <InvoiceActionsBar />

      <DashboardPageContent>
        <InvoicesViewPage />
        <InvoicesAlerts />
      </DashboardPageContent>
    </InvoicesListProvider>
  );
}

export default compose(
  withDashboardActions,
  withInvoices(({ invoicesTableQuery }) => ({
    invoicesTableQuery,
  })),
  withAlertsActions,
)(InvoicesList);
