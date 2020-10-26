import React, { useEffect, useCallback, useState, useMemo } from 'react';
import {
  Intent,
  Button,
  Classes,
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

import withPaymentMade from './withPaymentMade';
import withPaymentMadeActions from './withPaymentMadeActions';
import withCurrentView from 'containers/Views/withCurrentView';

function PaymentMadeDataTable({
  //#withPaymentMades
  paymentMadeCurrentPage,
  paymentMadePageination,
  paymentMadeLoading,
  paymentMadeItems,

  // #withDashboardActions
  changeCurrentView,
  changePageSubtitle,
  setTopbarEditView,

  // #withView
  viewMeta,

  //#OwnProps
  loading,
  onFetchData,
  onEditPaymentMade,
  onDeletePaymentMade,
  onSelectedRowsChange,
}) {
  const [initialMount, setInitialMount] = useState(false);
  const { custom_view_id: customViewId } = useParams();
  const { formatMessage } = useIntl();

  useEffect(() => {
    setInitialMount(false);
  }, [customViewId]);

  useUpdateEffect(() => {
    if (!paymentMadeLoading) {
      setInitialMount(true);
    }
  }, [paymentMadeLoading, setInitialMount]);



  const handleEditPaymentMade = useCallback(
    (paymentMade) => () => {
      onEditPaymentMade && onEditPaymentMade(paymentMade);
    },
    [onEditPaymentMade],
  );

  const handleDeletePaymentMade = useCallback(
    (paymentMade) => () => {
      onDeletePaymentMade && onDeletePaymentMade(paymentMade);
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
        accessor: (row) => `#${row.payment_number}`,
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

  return (
    <div>
      <LoadingIndicator loading={loading} mount={false}>
        <DataTable
          columns={columns}
          data={paymentMadeCurrentPage}
          onFetchData={handleDataTableFetchData}
          manualSortBy={true}
          selectionColumn={true}
          noInitialFetch={true}
          sticky={true}
          loading={paymentMadeLoading && !initialMount}
          onSelectedRowsChange={handleSelectedRowsChange}
          rowContextMenu={onRowContextMenu}
          pagination={true}
          pagesCount={paymentMadePageination.pagesCount}
          initialPageSize={paymentMadePageination.pageSize}
          initialPageIndex={paymentMadePageination.page - 1}
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
  withPaymentMadeActions,
  withPaymentMade(
    ({
      paymentMadeCurrentPage,
      paymentMadeLoading,
      paymentMadePageination,
    }) => ({
      paymentMadeCurrentPage,
      paymentMadeLoading,
      paymentMadePageination,
    }),
  ),
  withViewDetails(),
)(PaymentMadeDataTable);
