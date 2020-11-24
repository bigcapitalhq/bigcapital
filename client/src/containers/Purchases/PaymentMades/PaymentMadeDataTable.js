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
import { DataTable, Money, Icon, Choose, LoadingIndicator } from 'components';
import PaymentMadesEmptyStatus from './PaymentMadesEmptyStatus';

import withPaymentMade from './withPaymentMade';
import withPaymentMadeActions from './withPaymentMadeActions';
import withCurrentView from 'containers/Views/withCurrentView';

/**
 * Payment made datatable transactions.
 */
function PaymentMadeDataTable({
  // #withPaymentMades
  paymentMadeCurrentPage,
  paymentMadePageination,
  paymentMadesLoading,
  paymentMadeTableQuery,
  paymentMadesCurrentViewId,

  // #withPaymentMadeActions
  addPaymentMadesTableQueries,

  // #ownProps
  onEditPaymentMade,
  onDeletePaymentMade,
  onSelectedRowsChange,
}) {
  const isLoaded = useIsValuePassed(paymentMadesLoading, false);
  const { formatMessage } = useIntl();

  const handleEditPaymentMade = useCallback(
    (paymentMade) => () => {
      saveInvoke(onEditPaymentMade, paymentMade);
    },
    [onEditPaymentMade],
  );

  const handleDeletePaymentMade = useCallback(
    (paymentMade) => () => {
      saveInvoke(onDeletePaymentMade, paymentMade);
    },
    [onDeletePaymentMade],
  );

  const actionMenuList = useCallback(
    (paymentMade) => (
      <Menu>
        <MenuItem
          icon={<Icon icon="reader-18" />}
          text={formatMessage({ id: 'view_details' })}
        />
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={formatMessage({ id: 'edit_payment_made' })}
          onClick={handleEditPaymentMade(paymentMade)}
        />
        <MenuItem
          text={formatMessage({ id: 'delete_payment_made' })}
          intent={Intent.DANGER}
          onClick={handleDeletePaymentMade(paymentMade)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Menu>
    ),
    [handleDeletePaymentMade, handleEditPaymentMade, formatMessage],
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
        id: 'vendor_id',
        Header: formatMessage({ id: 'vendor_name' }),
        accessor: 'vendor.display_name',
        width: 140,
        className: 'vendor_id',
      },
      {
        id: 'payment_number',
        Header: formatMessage({ id: 'payment_number' }),
        accessor: (row) => (row.payment_number ? `#${row.payment_number}` : null),
        width: 140,
        className: 'payment_number',
      },
      {
        id: 'payment_account_id',
        Header: formatMessage({ id: 'payment_account' }),
        accessor: 'payment_account.name',
        width: 140,
        className: 'payment_account_id',
      },
      {
        id: 'amount',
        Header: formatMessage({ id: 'amount' }),
        accessor: (r) => <Money amount={r.amount} currency={'USD'} />,
        width: 140,
        className: 'amount',
      },
      {
        id: 'reference',
        Header: formatMessage({ id: 'reference' }),
        accessor: 'reference',
        width: 140,
        className: 'reference',
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
    ({ pageIndex, pageSize, sortBy }) => {
      addPaymentMadesTableQueries({
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
    [addPaymentMadesTableQueries],
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

  const showEmptyStatuts = [
    paymentMadeCurrentPage.length === 0,
    paymentMadesCurrentViewId === -1,
  ].every((condition) => condition === true);

  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <LoadingIndicator loading={paymentMadesLoading && !isLoaded}>
        <Choose>
          <Choose.When condition={showEmptyStatuts}>
            <PaymentMadesEmptyStatus />
          </Choose.When>

          <Choose.Otherwise>
            <DataTable
              columns={columns}
              data={paymentMadeCurrentPage}
              onFetchData={handleDataTableFetchData}
              manualSortBy={true}
              selectionColumn={true}
              noInitialFetch={true}
              sticky={true}
              onSelectedRowsChange={handleSelectedRowsChange}
              rowContextMenu={onRowContextMenu}
              pagination={true}
              pagesCount={paymentMadePageination.pagesCount}
              initialPageSize={paymentMadeTableQuery.page_size}
              initialPageIndex={paymentMadeTableQuery.page - 1}
              autoResetSortBy={false}
              autoResetPage={false}
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
  withPaymentMadeActions,
  withPaymentMade(
    ({
      paymentMadeCurrentPage,
      paymentMadesLoading,
      paymentMadePageination,
      paymentMadeTableQuery,
      paymentMadesCurrentViewId,
    }) => ({
      paymentMadeCurrentPage,
      paymentMadesLoading,
      paymentMadePageination,
      paymentMadeTableQuery,
      paymentMadesCurrentViewId,
    }),
  ),
)(PaymentMadeDataTable);
