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

import { compose, saveInvoke } from 'utils';
import { useIsValuePassed } from 'hooks';

import { Choose, LoadingIndicator, DataTable, Money, Icon } from 'components';

import ReceiptsEmptyStatus from './ReceiptsEmptyStatus';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import withReceipts from './withReceipts';
import withReceiptActions from './withReceiptActions';

function ReceiptsDataTable({
  // #withReceipts
  receiptsCurrentPage,
  receiptsLoading,
  receiptsPagination,
  receiptTableQuery,
  receiptsCurrentViewId,

  // #withReceiptsActions
  addReceiptsTableQueries,

  // #ownProps
  loading,
  onEditReceipt,
  onDeleteReceipt,
  onSelectedRowsChange,
}) {
  const { formatMessage } = useIntl();
  const isLoadedBefore = useIsValuePassed(receiptsLoading, false);

  const handleEditReceipt = useCallback(
    (receipt) => () => {
      saveInvoke(onEditReceipt, receipt);
    },
    [onEditReceipt],
  );

  const handleDeleteReceipt = useCallback(
    (receipt) => () => {
      saveInvoke(onDeleteReceipt, receipt);
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
      // {
      //   id: 'send_to_email',
      //   Header: formatMessage({ id: 'email' }),
      //   accessor: 'send_to_email',
      //   width: 140,
      //   className: 'send_to_email',
      // },
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
    ({ sortBy, pageIndex, pageSize }) => {
      const page = pageIndex + 1;

      addReceiptsTableQueries({
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
    [addReceiptsTableQueries],
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
    receiptsCurrentViewId === -1,
    receiptsCurrentPage.length === 0,
  ].every(condition => condition === true);

  return (
    <LoadingIndicator loading={receiptsLoading && !isLoadedBefore}>
      <Choose>
        <Choose.When condition={showEmptyStatus}>
          <ReceiptsEmptyStatus />
        </Choose.When>

        <Choose.Otherwise>
          <DataTable
            columns={columns}
            data={receiptsCurrentPage}
            onFetchData={handleDataTableFetchData}
            manualSortBy={true}
            selectionColumn={true}
            noInitialFetch={true}
            sticky={true}
            onSelectedRowsChange={handleSelectedRowsChange}
            rowContextMenu={onRowContextMenu}
            pagination={true}
            pagesCount={receiptsPagination.pagesCount}
            autoResetSortBy={false}
            autoResetPage={false}
            initialPageSize={receiptTableQuery.page_size}
            initialPageIndex={receiptTableQuery.page - 1}
          />
        </Choose.Otherwise>
      </Choose>
    </LoadingIndicator>
  );
}

export default compose(
  withRouter,
  withDialogActions,
  withDashboardActions,
  withReceiptActions,
  withReceipts(
    ({
      receiptsCurrentPage,
      receiptsLoading,
      receiptsPagination,
      receiptTableQuery,
      receiptsCurrentViewId
    }) => ({
      receiptsCurrentPage,
      receiptsLoading,
      receiptsPagination,
      receiptTableQuery,
      receiptsCurrentViewId
    }),
  ),
)(ReceiptsDataTable);
