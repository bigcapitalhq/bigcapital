import React, { useEffect, useCallback, useMemo } from 'react';
import {
  Intent,
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Tag,
} from '@blueprintjs/core';

import { useParams } from 'react-router-dom';
import { withRouter } from 'react-router';
import { FormattedMessage as T, useIntl } from 'react-intl';
import moment from 'moment';
import classNames from 'classnames';

import Icon from 'components/Icon';
import { compose, saveInvoke } from 'utils';
import { CLASSES } from 'common/classes';
import { useIsValuePassed } from 'hooks';

import { LoadingIndicator, Choose, If } from 'components';
import DataTable from 'components/DataTable';
import BillsEmptyStatus from './BillsEmptyStatus';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withViewDetails from 'containers/Views/withViewDetails';

import withBills from './withBills';
import withBillActions from './withBillActions';
import withCurrentView from 'containers/Views/withCurrentView';

// Bills transactions datatable.
function BillsDataTable({
  // #withBills
  billsCurrentPage,
  billsLoading,
  billsPageination,
  billsCurrentViewId,

  // #withDashboardActions
  changeCurrentView,
  changePageSubtitle,
  setTopbarEditView,

  // #withBillsActions
  addBillsTableQueries,

  // #withView
  viewMeta,

  // #ownProps
  loading,
  onFetchData,
  onEditBill,
  onDeleteBill,
  onOpenBill,
  onSelectedRowsChange,
}) {
  const { custom_view_id: customViewId } = useParams();
  const { formatMessage } = useIntl();
  const isLoadedBefore = useIsValuePassed(billsLoading, false);

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

  const handleFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      const page = pageIndex + 1;

      addBillsTableQueries({
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
    [addBillsTableQueries],
  );

  const handleEditBill = useCallback(
    (_bill) => () => {
      saveInvoke(onEditBill, _bill);
    },
    [onEditBill],
  );

  const handleDeleteBill = useCallback(
    (_bill) => () => {
      saveInvoke(onDeleteBill, _bill);
    },
    [onDeleteBill],
  );

  const actionMenuList = useCallback(
    (bill) => (
      <Menu>
        <MenuItem
          icon={<Icon icon="reader-18" />}
          text={formatMessage({ id: 'view_details' })}
        />
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={formatMessage({ id: 'edit_bill' })}
          onClick={handleEditBill(bill)}
        />
        <If condition={!bill.is_open}>
          <MenuItem
            text={formatMessage({ id: 'mark_as_opened' })}
            onClick={() => onOpenBill(bill)}
          />
        </If>

        <MenuItem
          text={formatMessage({ id: 'delete_bill' })}
          intent={Intent.DANGER}
          onClick={handleDeleteBill(bill)}
          icon={<Icon icon="trash-16" iconSize={16} />}
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
        accessor: (row) => (row.bill_number ? `#${row.bill_number}` : null),
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
        accessor: (row) => (
          <Choose>
            <Choose.When condition={row.is_open}>
              <Tag minimal={true}>
                <T id={'opened'} />
              </Tag>
            </Choose.When>

            <Choose.Otherwise>
              <Tag minimal={true} intent={Intent.WARNING}>
                <T id={'draft'} />
              </Tag>
            </Choose.Otherwise>
          </Choose>
        ),
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
    billsCurrentViewId === -1,
    billsCurrentPage.length === 0,
  ].every((condition) => condition === true);

  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <LoadingIndicator loading={billsLoading && !isLoadedBefore} mount={false}>
        <Choose>
          <Choose.When condition={showEmptyStatus}>
            <BillsEmptyStatus />
          </Choose.When>

          <Choose.Otherwise>
            <DataTable
              columns={columns}
              data={billsCurrentPage}
              onFetchData={handleFetchData}
              manualSortBy={true}
              selectionColumn={true}
              noInitialFetch={true}
              sticky={true}
              onSelectedRowsChange={handleSelectedRowsChange}
              rowContextMenu={onRowContextMenu}
              pagination={true}
              pagesCount={billsPageination.pagesCount}
              initialPageSize={billsPageination.pageSize}
              initialPageIndex={billsPageination.page - 1}
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
  withBillActions,
  withBills(
    ({
      billsCurrentPage,
      billsLoading,
      billsPageination,
      billsTableQuery,
      billsCurrentViewId,
    }) => ({
      billsCurrentPage,
      billsLoading,
      billsPageination,
      billsTableQuery,
      billsCurrentViewId,
    }),
  ),
  withViewDetails(),
)(BillsDataTable);
