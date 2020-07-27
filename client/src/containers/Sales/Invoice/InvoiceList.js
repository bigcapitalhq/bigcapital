import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useQuery, queryCache } from 'react-query';
import { Alert, Intent } from '@blueprintjs/core';

import AppToaster from 'components/AppToaster';
import { FormattedMessage as T, useIntl } from 'react-intl';
import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
// import withInvoiceActions from './withInvoiceActions'

// import InvoiceActionsBar from './InvoiceActionsBar';

import { compose } from 'utils';
import InvoiceActionsBar from './InvoiceActionsBar';

function InvoiceList({
  // #withDashboardActions
  changePageTitle,

  // #withViewsActions

  //#withInvoice

  //#withInvoiceActions
}) {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const [deleteInvoice, setDeleteInvoice] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    changePageTitle(formatMessage({ id: 'invoice_list' }));
  }, [changePageTitle, formatMessage]);

  //handle dalete Invoice
  const handleDeleteInvoice = useCallback(
    (invoice) => {
      setDeleteInvoice(invoice);
    },
    [setDeleteInvoice],
  );

  // handle cancel Invoice
  const handleCancelInvoiceDelete = useCallback(() => {
    setDeleteInvoice(false);
  }, [setDeleteInvoice]);

  // handleConfirm delete invoice
  const handleConfirmInvoiceDelete = useCallback(() => {
    requestDeleteInvoice(deleteInvoice.id).then(() => {
      AppToaster.show({
        message: formatMessage({
          id: 'the_invocie_has_been_successfully_deleted',
        }),
        intent: Intent.SUCCESS,
      });
      setDeleteInvoice(false);
    });
  }, [setDeleteInvoice, requestDeleteInvoice]);

  const handleEditInvoice = useCallback((invoice) => {
    history.push(`/invoices/${invoice.id}/edit`);
  });

  const fetchInvoice = useQuery(['invoice-table'], () =>
    requsetFetchInvoiceTable(),
  );

  const handleFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      const page = pageIndex + 1;

      addInvoiceTableQueries({
        ...(sortBy.length > 0
          ? {
              column_sort_by: sortBy[0].id,
              sort_order: sortBy[0].desc ? 'desc' : 'asc',
            }
          : {}),
        page_size: pageSize,
        page,
      });
    },
    [addInvoiceTableQueries],
  );
  const handleSelectedRowsChange = useCallback((_invoice) => {
    selectedRows(_invoice);
  });

  return (
    <DashboardInsider name={'invoices'}>
      <InvoiceActionsBar 
      // onBulkDelete={}
      selectedRows={selectedRows}
      // onFilterChanged={}
      />
      <DashboardPageContent>
        <Switch>
          <Route></Route>
        </Switch>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default InvoiceList;
