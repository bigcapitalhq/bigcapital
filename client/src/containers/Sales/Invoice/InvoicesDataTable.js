import React, { useCallback, useMemo } from 'react';
import {
  Intent,
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
} from '@blueprintjs/core';
import { withRouter } from 'react-router';
import { FormattedMessage as T, useIntl } from 'react-intl';
import moment from 'moment';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';

import { compose, saveInvoke } from 'utils';
import { useIsValuePassed } from 'hooks';

import {
  LoadingIndicator,
  Choose,
  If,
  DataTable,
  Money,
  Icon,
} from 'components';
import InvoicesEmptyStatus from './InvoicesEmptyStatus';
import { statusAccessor } from './components';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetails from 'containers/Views/withViewDetails';

import withInvoices from './withInvoices';
import withInvoiceActions from './withInvoiceActions';
import withCurrentView from 'containers/Views/withCurrentView';
import withSettings from 'containers/Settings/withSettings';

// Invoices datatable.
function InvoicesDataTable({
  // #withInvoices
  invoicesCurrentPage,
  invoicesLoading,
  invoicesPageination,
  invoicesCurrentViewId,

  // #withInvoicesActions
  addInvoiceTableQueries,

  // #withSettings
  baseCurrency,

  // #OwnProps
  onEditInvoice,
  onDeleteInvoice,
  onDeliverInvoice,
  onDrawerInvoice,
  onSelectedRowsChange,
}) {
  const { formatMessage } = useIntl();
  const isLoadedBefore = useIsValuePassed(invoicesLoading, false);

  const handleEditInvoice = useCallback(
    (_invoice) => () => {
      saveInvoke(onEditInvoice, _invoice);
    },
    [onEditInvoice],
  );

  const handleDeleteInvoice = useCallback(
    (_invoice) => () => {
      saveInvoke(onDeleteInvoice, _invoice);
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
        <If condition={!invoice.is_delivered}>
          <MenuItem
            text={formatMessage({ id: 'mark_as_delivered' })}
            onClick={() => onDeliverInvoice(invoice)}
          />
        </If>
        <MenuItem
          text={formatMessage({ id: 'invoice_paper' })}
          onClick={() => onDrawerInvoice()}
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
        width: 110,
        className: 'invoice_date',
      },
      {
        id: 'customer_id',
        Header: formatMessage({ id: 'customer_name' }),
        accessor: 'customer.display_name',
        width: 180,
        className: 'customer_id',
      },
      {
        id: 'invoice_no',
        Header: formatMessage({ id: 'invoice_no__' }),
        accessor: (row) => (row.invoice_no ? `#${row.invoice_no}` : null),
        width: 100,
        className: 'invoice_no',
      },
      {
        id: 'balance',
        Header: formatMessage({ id: 'balance' }),
        accessor: (r) => <Money amount={r.balance} currency={baseCurrency} />,
        width: 110,
        className: 'balance',
      },
      {
        id: 'status',
        Header: formatMessage({ id: 'status' }),
        accessor: (row) => statusAccessor(row),
        width: 160,
        className: 'status',
      },
      {
        id: 'due_date',
        Header: formatMessage({ id: 'due_date' }),
        accessor: (r) => moment(r.due_date).format('YYYY MMM DD'),
        width: 110,
        className: 'due_date',
      },
      {
        id: 'reference_no',
        Header: formatMessage({ id: 'reference_no' }),
        accessor: 'reference_no',
        width: 90,
        className: 'reference_no',
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
    ({ pageSize, pageIndex, sortBy }) => {
      addInvoiceTableQueries({
        ...(sortBy.length > 0
          ? {
              column_sort_by: sortBy[0].id,
              sort_order: sortBy[0].desc ? 'desc' : 'asc',
            }
          : {}),
        page_size: pageSize,
        page: pageIndex + 1,
      });
    },
    [addInvoiceTableQueries],
  );

  const handleSelectedRowsChange = useCallback(
    (selectedRows) => {
      saveInvoke(
        onSelectedRowsChange,
        selectedRows.map((s) => s.original),
      );
    },
    [onSelectedRowsChange],
  );

  const showEmptyStatus = [
    invoicesCurrentPage.length === 0,
    invoicesCurrentViewId === -1,
  ].every((d) => d === true);

  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <LoadingIndicator loading={invoicesLoading && !isLoadedBefore}>
        <Choose>
          <Choose.When condition={showEmptyStatus}>
            <InvoicesEmptyStatus />
          </Choose.When>

          <Choose.Otherwise>
            <DataTable
              columns={columns}
              data={invoicesCurrentPage}
              onFetchData={handleDataTableFetchData}
              manualSortBy={true}
              selectionColumn={true}
              noInitialFetch={true}
              sticky={true}
              onSelectedRowsChange={handleSelectedRowsChange}
              rowContextMenu={onRowContextMenu}
              pagination={true}
              autoResetSortBy={false}
              autoResetPage={false}
              pagesCount={invoicesPageination.pagesCount}
              initialPageSize={invoicesPageination.pageSize}
              initialPageIndex={invoicesPageination.page - 1}
            />
          </Choose.Otherwise>
        </Choose>
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
    ({
      invoicesCurrentPage,
      invoicesLoading,
      invoicesPageination,
      invoicesTableQuery,
      invoicesCurrentViewId,
    }) => ({
      invoicesCurrentPage,
      invoicesLoading,
      invoicesPageination,
      invoicesTableQuery,
      invoicesCurrentViewId,
    }),
  ),
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
  withViewDetails(),
)(InvoicesDataTable);
