import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import 'style/pages/SaleInvoice/List.scss';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import InvoiceActionsBar from './InvoiceActionsBar';
import { InvoicesListProvider } from './InvoicesListProvider';

import InvoiceViewTabs from './InvoiceViewTabs';
import InvoicesDataTable from './InvoicesDataTable';
import InvoicesAlerts from '../InvoicesAlerts';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withInvoices from './withInvoices';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { transformTableStateToQuery, compose } from 'utils';

/**
 * Sale invoices list.
 */
function InvoicesList({
  // #withDashboardActions
  changePageTitle,

  // #withInvoice
  invoicesTableState,
}) {
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'invoices_list' }));
  }, [changePageTitle, formatMessage]);

  return (
    <InvoicesListProvider
      query={transformTableStateToQuery(invoicesTableState)}
    >
      <InvoiceActionsBar />

      <DashboardPageContent>
        <InvoiceViewTabs />
        <InvoicesDataTable />
      </DashboardPageContent>

      <InvoicesAlerts />
    </InvoicesListProvider>
  );
}

export default compose(
  withDashboardActions,
  withInvoices(({ invoicesTableState }) => ({ invoicesTableState })),
  withAlertsActions,
)(InvoicesList);
