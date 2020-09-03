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

import withPaymentReceives from './withPaymentReceives';
import withPaymentReceivesActions from './withPaymentReceivesActions';
import withCurrentView from 'containers/Views/withCurrentView';

function PaymentReceivesDataTable({
  //#withPaymentReceives
  PaymentReceivesCurrentPage,
  paymentReceivesPageination,
  paymentReceivesLoading,
  paymentReceivesItems,

  // #withDashboardActions
  changeCurrentView,
  changePageSubtitle,
  setTopbarEditView,

  // #withView
  viewMeta,

  //#OwnProps
  loading,
  onFetchData,
  onEditPaymentReceive,
  onDeletePaymentReceive,
  onSelectedRowsChange,
}) {
  const [initialMount, setInitialMount] = useState(false);
  const { custom_view_id: customViewId } = useParams();
  const { formatMessage } = useIntl();

  useEffect(() => {
    setInitialMount(false);
  }, [customViewId]);

  useUpdateEffect(() => {
    if (!paymentReceivesLoading) {
      setInitialMount(true);
    }
  }, [paymentReceivesLoading, setInitialMount]);

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

  const handleEditPaymentReceive = useCallback(
    (paymentReceive) => () => {
      onEditPaymentReceive && onEditPaymentReceive(paymentReceive);
    },
    [onEditPaymentReceive],
  );

  const handleDeletePaymentReceive = useCallback(
    (paymentReceive) => () => {
      onDeletePaymentReceive && onDeletePaymentReceive(paymentReceive);
    },
    [onDeletePaymentReceive],
  );

  const actionMenuList = useCallback(
    (paymentReceive) => (
      <Menu>
        <MenuItem text={formatMessage({ id: 'view_details' })} />
        <MenuDivider />
        <MenuItem
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
        accessor: (row) => `#${row.payment_receive_no}`,
        width: 140,
        className: 'payment_receive_no',
      },
      {
        id: 'amount',
        Header: formatMessage({ id: 'amount' }),
        accessor: (r) => <Money amount={r.amount} currency={'USD'} />,
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
          data={PaymentReceivesCurrentPage}
          onFetchData={handleDataTableFetchData}
          manualSortBy={true}
          selectionColumn={true}
          noInitialFetch={true}
          sticky={true}
          loading={paymentReceivesLoading && !initialMount}
          onSelectedRowsChange={handleSelectedRowsChange}
          rowContextMenu={onRowContextMenu}
          pagination={true}
          pagesCount={paymentReceivesPageination.pagesCount}
          initialPageSize={paymentReceivesPageination.pageSize}
          initialPageIndex={paymentReceivesPageination.page - 1}
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
  withPaymentReceivesActions,
  withPaymentReceives(
    ({
      PaymentReceivesCurrentPage,
      paymentReceivesLoading,
      paymentReceivesPageination,
    }) => ({
      PaymentReceivesCurrentPage,
      paymentReceivesLoading,
      paymentReceivesPageination,
    }),
  ),
  withViewDetails(),
)(PaymentReceivesDataTable);
