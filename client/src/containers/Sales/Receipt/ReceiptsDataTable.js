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

import withReceipts from './withReceipts';
import withReceiptActions from './withReceiptActions';
import withCurrentView from 'containers/Views/withCurrentView';

function ReceiptsDataTable({
  //#withReceipts
  receiptsCurrentPage,
  receiptsLoading,
  receiptsPagination,
  receiptItems,
  // #withDashboardActions
  changeCurrentView,
  changePageSubtitle,
  setTopbarEditView,

  // #withView
  viewMeta,

  // #Own Props

  loading,
  onFetchData,
  onEditReceipt,
  onDeleteReceipt,
  onSelectedRowsChange,
}) {
  const [initialMount, setInitialMount] = useState(false);
  const { custom_view_id: customViewId } = useParams();
  const { formatMessage } = useIntl();

  useUpdateEffect(() => {
    if (!receiptsLoading) {
      setInitialMount(true);
    }
  }, [receiptsLoading, setInitialMount]);

  useEffect(() => {
    setInitialMount(false);
  }, []);

  useEffect(() => {
    if (customViewId) {
      changeCurrentView(customViewId);
      setTopbarEditView(customViewId);
    }
    changePageSubtitle(customViewId && viewMeta ? viewMeta.name : '');
  }, [
    customViewId,
    changeCurrentView,
    changePageSubtitle,
    setTopbarEditView,
    viewMeta,
  ]);

  const handleEditReceipt = useCallback(
    (receipt) => () => {
      onEditReceipt && onEditReceipt(receipt);
    },
    [onEditReceipt],
  );

  const handleDeleteReceipt = useCallback(
    (receipt) => () => {
      onDeleteReceipt && onDeleteReceipt(receipt);
    },
    [onDeleteReceipt],
  );

  const actionMenuList = useCallback(
    (estimate) => (
      <Menu>
        <MenuItem
          icon={<Icon icon="reader-18" />}
          text={formatMessage({ id: 'view_details' })}
        />
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={formatMessage({ id: 'edit_receipt' })}
          onClick={handleEditReceipt(estimate)}
        />
        <MenuItem
          text={formatMessage({ id: 'delete_receipt' })}
          intent={Intent.DANGER}
          onClick={handleDeleteReceipt(estimate)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Menu>
    ),
    [handleDeleteReceipt, handleEditReceipt, formatMessage],
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
        id: 'receipt_date',
        Header: formatMessage({ id: 'receipt_date' }),
        accessor: (r) => moment(r.receipt_date).format('YYYY MMM DD'),
        width: 140,
        className: 'receipt_date',
      },
      {
        id: 'customer_id',
        Header: formatMessage({ id: 'customer_name' }),
        accessor: 'customer.display_name',
        width: 140,
        className: 'customer_id',
      },
      {
        id: 'receipt_number',
        Header: formatMessage({ id: 'receipt_number' }),
        accessor: (row) => `#${row.receipt_number}`,
        width: 140,
        className: 'receipt_number',
      },
      {
        id: 'deposit_account_id',
        Header: formatMessage({ id: 'deposit_account' }),
        accessor: 'deposit_account.name',
        width: 140,
        className: 'deposit_account',
      },
      {
        id: 'send_to_email',
        Header: formatMessage({ id: 'email' }),
        accessor: 'send_to_email',
        width: 140,
        className: 'send_to_email',
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

  console.log(receiptsCurrentPage, 'receiptCurrnetPage');
  console.log(receiptItems, 'receiptItems');

  return (
    <div>
      <LoadingIndicator loading={loading} mount={false}>
        <DataTable
          columns={columns}
          data={receiptsCurrentPage}
          loading={receiptsLoading && !initialMount}
          onFetchData={handleDataTableFetchData}
          manualSortBy={true}
          selectionColumn={true}
          noInitialFetch={true}
          sticky={true}
          onSelectedRowsChange={handleSelectedRowsChange}
          rowContextMenu={onRowContextMenu}
          pagination={true}
          pagesCount={receiptsPagination.pagesCount}
          initialPageSize={receiptsPagination.pageSize}
          initialPageIndex={receiptsPagination.page - 1}
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
  withReceiptActions,
  withReceipts(
    ({
      receiptsCurrentPage,
      receiptsLoading,
      receiptsPagination,
      receiptItems,
    }) => ({
      receiptsCurrentPage,
      receiptsLoading,
      receiptsPagination,
      receiptItems,
    }),
  ),
  withViewDetails(),
)(ReceiptsDataTable);
