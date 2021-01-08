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

import { compose, saveInvoke } from 'utils';
import { useIsValuePassed } from 'hooks';

import { CLASSES } from 'common/classes';

import PaymentReceivesEmptyStatus from './PaymentReceivesEmptyStatus';
import { LoadingIndicator, DataTable, Choose, Money, Icon } from 'components';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetails from 'containers/Views/withViewDetails';

import withPaymentReceives from './withPaymentReceives';
import withPaymentReceivesActions from './withPaymentReceivesActions';
import withCurrentView from 'containers/Views/withCurrentView';
import withSettings from 'containers/Settings/withSettings';

function PaymentReceivesDataTable({
  // #withPaymentReceives
  PaymentReceivesCurrentPage,
  paymentReceivesPageination,
  paymentReceivesLoading,
  paymentReceivesTableQuery,
  paymentReceivesCurrentViewId,

  // #withPaymentReceivesActions
  addPaymentReceivesTableQueries,

  // #withSettings
  baseCurrency,
  
  // #OwnProps
  onEditPaymentReceive,
  onDeletePaymentReceive,
  onSelectedRowsChange,
}) {
  const isLoaded = useIsValuePassed(paymentReceivesLoading, false);
  const { formatMessage } = useIntl();

  const handleEditPaymentReceive = useCallback(
    (paymentReceive) => () => {
      saveInvoke(onEditPaymentReceive, paymentReceive);
    },
    [onEditPaymentReceive],
  );

  const handleDeletePaymentReceive = useCallback(
    (paymentReceive) => () => {
      onDeletePaymentReceive && onDeletePaymentReceive(paymentReceive);
    },
    [onDeletePaymentReceive],
  );

  const handleDataTableFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      addPaymentReceivesTableQueries({
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
    [addPaymentReceivesTableQueries],
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

  const actionMenuList = useCallback(
    (paymentReceive) => (
      <Menu>
        <MenuItem
          icon={<Icon icon="reader-18" />}
          text={formatMessage({ id: 'view_details' })}
        />
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={formatMessage({ id: 'edit_payment_receive' })}
          onClick={handleEditPaymentReceive(paymentReceive)}
        />
        <MenuItem
          text={formatMessage({ id: 'delete_payment_receive' })}
          intent={Intent.DANGER}
          onClick={handleDeletePaymentReceive(paymentReceive)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Menu>
    ),
    [handleDeletePaymentReceive, handleEditPaymentReceive, formatMessage],
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
        id: 'payment_date',
        Header: formatMessage({ id: 'payment_date' }),
        accessor: (r) => moment(r.payment_date).format('YYYY MMM DD'),
        width: 140,
        className: 'payment_date',
      },
      {
        id: 'customer_id',
        Header: formatMessage({ id: 'customer_name' }),
        accessor: 'customer.display_name',
        width: 140,
        className: 'customer_id',
      },
      {
        id: 'payment_receive_no',
        Header: formatMessage({ id: 'payment_receive_no' }),
        accessor: (row) =>
          row.payment_receive_no ? `#${row.payment_receive_no}` : null,
        width: 140,
        className: 'payment_receive_no',
      },
      {
        id: 'amount',
        Header: formatMessage({ id: 'amount' }),
        accessor: (r) => <Money amount={r.amount} currency={baseCurrency} />,
        width: 140,
        className: 'amount',
      },
      {
        id: 'reference_no',
        Header: formatMessage({ id: 'reference_no' }),
        accessor: 'reference_no',
        width: 140,
        className: 'reference_no',
      },
      {
        id: 'deposit_account_id',
        Header: formatMessage({ id: 'deposit_account' }),
        accessor: 'deposit_account.name',
        width: 140,
        className: 'deposit_account_id',
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

  const showEmptyStatus = [
    paymentReceivesCurrentViewId === -1,
    PaymentReceivesCurrentPage.length === 0,
  ].every((condition) => condition === true);

  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <LoadingIndicator
        loading={paymentReceivesLoading && !isLoaded}
        mount={false}
      >
        <Choose>
          <Choose.When condition={showEmptyStatus}>
            <PaymentReceivesEmptyStatus />
          </Choose.When>

          <Choose.Otherwise>
            <DataTable
              columns={columns}
              data={PaymentReceivesCurrentPage}
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
              pagesCount={paymentReceivesPageination.pagesCount}
              initialPageSize={paymentReceivesTableQuery.page_size}
              initialPageIndex={paymentReceivesTableQuery.page - 1}
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
  withPaymentReceivesActions,
  withPaymentReceives(
    ({
      PaymentReceivesCurrentPage,
      paymentReceivesLoading,
      paymentReceivesPageination,
      paymentReceivesTableQuery,
      paymentReceivesCurrentViewId,
    }) => ({
      PaymentReceivesCurrentPage,
      paymentReceivesLoading,
      paymentReceivesPageination,
      paymentReceivesTableQuery,
      paymentReceivesCurrentViewId,
    }),
  ),
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
  withViewDetails(),
)(PaymentReceivesDataTable);
