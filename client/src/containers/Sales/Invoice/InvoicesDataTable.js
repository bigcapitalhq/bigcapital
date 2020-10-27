import React, { useEffect, useCallback, useState, useMemo } from 'react';
import {
  Intent,
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
} from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import { withRouter } from 'react-router';
import { FormattedMessage as T, useIntl } from 'react-intl';
import moment from 'moment';

import { compose } from 'utils';
import { useUpdateEffect } from 'hooks';

import LoadingIndicator from 'components/LoadingIndicator';
import { DataTable, Money, Icon } from 'components';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetails from 'containers/Views/withViewDetails';

import withInvoices from './withInvoices';
import withInvoiceActions from './withInvoiceActions';
import withCurrentView from 'containers/Views/withCurrentView';

function InvoicesDataTable({
  //#withInvoices
  invoicesCurrentPage,
  invoicesLoading,
  invoicesPageination,
  invoicesItems,

  // #withDashboardActions
  changeCurrentView,
  changePageSubtitle,
  setTopbarEditView,

  // #withView
  viewMeta,

  //#OwnProps
  loading,
  onFetchData,
  onEditInvoice,
  onDeleteInvoice,
  onSelectedRowsChange,
}) {
  const [initialMount, setInitialMount] = useState(false);
  const { custom_view_id: customViewId } = useParams();
  const { formatMessage } = useIntl();

  useEffect(() => {
    setInitialMount(false);
  }, [customViewId]);

  useUpdateEffect(() => {
    if (!invoicesLoading) {
      setInitialMount(true);
    }
  }, [invoicesLoading, setInitialMount]);

  // useEffect(() => {
  //   if (customViewId) {
  //     changeCurrentView(customViewId);
  //     setTopbarEditView(customViewId);
  //   }
  //   changePageSubtitle(customViewId && viewMeta ? viewMeta.name : '');
  // }, [
  //   customViewId,
  //   changeCurrentView,
  //   changePageSubtitle,
  //   setTopbarEditView,
  //   viewMeta,
  // ]);

  const handleEditInvoice = useCallback(
    (_invoice) => () => {
      onEditInvoice && onEditInvoice(_invoice);
    },
    [onEditInvoice],
  );

  const handleDeleteInvoice = useCallback(
    (_invoice) => () => {
      onDeleteInvoice && onDeleteInvoice(_invoice);
    },
    [onDeleteInvoice],
  );

  const actionMenuList = useCallback(
    (invoice) => (
      <Menu>
        <MenuItem
          icon={<Icon icon="reader-18" />}
          text={formatMessage({ id: 'view_details' })}
        />
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={formatMessage({ id: 'edit_invoice' })}
          onClick={handleEditInvoice(invoice)}
        />
        <MenuItem
          text={formatMessage({ id: 'delete_invoice' })}
          intent={Intent.DANGER}
          onClick={handleDeleteInvoice(invoice)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Menu>
    ),
    [handleDeleteInvoice, handleEditInvoice, formatMessage],
  );

  const onRowContextMenu = useCallback(
    (cell) => {
      return actionMenuList(cell.row.original);
    },
    [actionMenuList],
  );

  const columns = useMemo(
    () => [
      {
        id: 'invoice_date',
        Header: formatMessage({ id: 'invoice_date' }),
        accessor: (r) => moment(r.invoice_date).format('YYYY MMM DD'),
        width: 140,
        className: 'invoice_date',
      },
      {
        id: 'customer_id',
        Header: formatMessage({ id: 'customer_name' }),
        accessor: 'customer.display_name',
        width: 140,
        className: 'customer_id',
      },
      {
        id: 'invoice_no',
        Header: formatMessage({ id: 'invoice_no__' }),
        accessor: (row) => `#${row.invoice_no}`,
        width: 140,
        className: 'invoice_no',
      },

      {
        id: 'due_date',
        Header: formatMessage({ id: 'due_date' }),
        accessor: (r) => moment(r.due_date).format('YYYY MMM DD'),
        width: 140,
        className: 'due_date',
      },
      {
        id: 'balance',
        Header: formatMessage({ id: 'balance' }),
        accessor: (r) => <Money amount={r.balance} currency={'USD'} />,
        width: 140,
        className: 'balance',
      },
      {
        id: 'reference_no',
        Header: formatMessage({ id: 'reference_no' }),
        accessor: 'reference_no',
        width: 140,
        className: 'reference_no',
      },
      {
        id: 'status',
        Header: formatMessage({ id: 'status' }),
        accessor: 'status',
        width: 140,
        className: 'status',
      },
      {
        id: 'actions',
        Header: '',
        Cell: ({ cell }) => (
          <Popover
            content={actionMenuList(cell.row.original)}
            position={Position.RIGHT_BOTTOM}
          >
            <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
          </Popover>
        ),
        className: 'actions',
        width: 50,
        disableResizing: true,
      },
    ],
    [actionMenuList, formatMessage],
  );

  const handleDataTableFetchData = useCallback(
    (...args) => {
      onFetchData && onFetchData(...args);
    },
    [onFetchData],
  );
  const handleSelectedRowsChange = useCallback(
    (selectedRows) => {
      onSelectedRowsChange &&
        onSelectedRowsChange(selectedRows.map((s) => s.original));
    },
    [onSelectedRowsChange],
  );

  const selectionColumn = useMemo(
    () => ({
      minWidth: 40,
      width: 40,
      maxWidth: 40,
    }),
    [],
  );

  return (
    <div>
      <LoadingIndicator loading={loading} mount={false}>
        <DataTable
          columns={columns}
          data={invoicesCurrentPage}
          onFetchData={handleDataTableFetchData}
          manualSortBy={true}
          selectionColumn={true}
          noInitialFetch={true}
          sticky={true}
          loading={invoicesLoading && !initialMount}
          onSelectedRowsChange={handleSelectedRowsChange}
          rowContextMenu={onRowContextMenu}
          pagination={true}
          pagesCount={invoicesPageination.pagesCount}
          initialPageSize={invoicesPageination.pageSize}
          initialPageIndex={invoicesPageination.page - 1}
        />
      </LoadingIndicator>
    </div>
  );
}

export default compose(
  withRouter,
  withCurrentView,
  withDialogActions,
  withDashboardActions,
  withInvoiceActions,
  withInvoices(
    ({ invoicesCurrentPage, invoicesLoading, invoicesPageination }) => ({
      invoicesCurrentPage,
      invoicesLoading,
      invoicesPageination,
    }),
  ),
  withViewDetails(),
)(InvoicesDataTable);
