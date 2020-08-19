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

import Icon from 'components/Icon';
import { compose } from 'utils';
import { useUpdateEffect } from 'hooks';

import LoadingIndicator from 'components/LoadingIndicator';
import DataTable from 'components/DataTable';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetails from 'containers/Views/withViewDetails';

import withBills from './withBills';
import withBillActions from './withBillActions';
import withCurrentView from 'containers/Views/withCurrentView';

function BillsDataTable({
  //#withBills
  billsCurrentPage,
  billsLoading,
  billsPageination,

  // #withDashboardActions
  changeCurrentView,
  changePageSubtitle,
  setTopbarEditView,

  // #withView
  viewMeta,

  //#OwnProps
  loading,
  onFetchData,
  onEditBill,
  onDeleteBill,
  onSelectedRowsChange,
}) {
  const [initialMount, setInitialMount] = useState(false);
  const { custom_view_id: customViewId } = useParams();
  const { formatMessage } = useIntl();

  useEffect(() => {
    setInitialMount(false);
  }, [customViewId]);

  useUpdateEffect(() => {
    if (!billsLoading) {
      setInitialMount(true);
    }
  }, [billsLoading, setInitialMount]);

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

  const handleEditBill = useCallback(
    (_bill) => () => {
      onEditBill && onEditBill(_bill);
    },
    [onEditBill],
  );

  const handleDeleteBill = useCallback(
    (_bill) => () => {
      onDeleteBill && onDeleteBill(_bill);
    },
    [onDeleteBill],
  );

  const actionMenuList = useCallback(
    (bill) => (
      <Menu>
        <MenuItem text={formatMessage({ id: 'view_details' })} />
        <MenuDivider />
        <MenuItem
          text={formatMessage({ id: 'edit_bill' })}
          onClick={handleEditBill(bill)}
        />
        <MenuItem
          text={formatMessage({ id: 'delete_bill' })}
          intent={Intent.DANGER}
          onClick={handleDeleteBill(bill)}
        />
      </Menu>
    ),
    [handleDeleteBill, handleEditBill, formatMessage],
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
        id: 'bill_date',
        Header: formatMessage({ id: 'bill_date' }),
        accessor: (r) => moment(r.bill_date).format('YYYY MMM DD'),
        width: 140,
        className: 'bill_date',
      },
      {
        id: 'vendor_id',
        Header: formatMessage({ id: 'vendor_name' }),
        accessor: 'vendor.display_name',
        width: 140,
        className: 'vendor_id',
      },
      {
        id: 'bill_number',
        Header: formatMessage({ id: 'bill_number' }),
        accessor: (row) => `#${row.bill_number}`,
        width: 140,
        className: 'bill_number',
      },

      {
        id: 'due_date',
        Header: formatMessage({ id: 'due_date' }),
        accessor: (r) => moment(r.due_date).format('YYYY MMM DD'),
        width: 140,
        className: 'due_date',
      },
      {
        id: 'amount',
        Header: formatMessage({ id: 'amount' }),
        accessor: 'amount',
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

  return (
    <div>
      <LoadingIndicator loading={loading} mount={false}>
        <DataTable
          columns={columns}
          data={billsCurrentPage}
          onFetchData={handleDataTableFetchData}
          manualSortBy={true}
          selectionColumn={true}
          noInitialFetch={true}
          sticky={true}
          loading={billsLoading && !initialMount}
          onSelectedRowsChange={handleSelectedRowsChange}
          rowContextMenu={onRowContextMenu}
          pagination={true}
          pagesCount={billsPageination.pagesCount}
          initialPageSize={billsPageination.pageSize}
          initialPageIndex={billsPageination.page - 1}
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
  withBillActions,
  withBills(({ billsCurrentPage, billsLoading, billsPageination }) => ({
    billsCurrentPage,
    billsLoading,
    billsPageination,
  })),
  withViewDetails(),
)(BillsDataTable);
