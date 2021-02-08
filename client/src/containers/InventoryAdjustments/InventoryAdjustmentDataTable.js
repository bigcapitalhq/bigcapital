  import React, { useCallback, useMemo } from 'react';
import {
  Button,
  Popover,
  Menu,
  Intent,
  MenuItem,
  MenuDivider,
  Position,
} from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import moment from 'moment';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';

import { DataTable, Icon } from 'components';
import { CLASSES } from 'common/classes';
import {
  PublishAccessor,
  TypeAccessor,
} from './components';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withInventoryAdjustmentActions from './withInventoryAdjustmentActions';

import { compose, saveInvoke } from 'utils';

function InventoryAdjustmentDataTable({
  // withInventoryAdjustmentsActions
  addInventoryAdjustmentTableQueries,

  // #ownProps
  isLoading,
  inventoryAdjustments,
  pagination,
  onDeleteInventoryAdjustment,
  onSelectedRowsChange,
}) {
  const { formatMessage } = useIntl();

  const handleDeleteInventoryAdjustment = useCallback(
    (_adjustment) => () => {
      saveInvoke(onDeleteInventoryAdjustment, _adjustment);
    },
    [onDeleteInventoryAdjustment],
  );

  const actionMenuList = useCallback(
    (adjustment) => (
      <Menu>
        <MenuItem
          icon={<Icon icon="reader-18" />}
          text={formatMessage({ id: 'view_details' })}
        />
        <MenuDivider />
        <MenuItem
          text={formatMessage({ id: 'delete_adjustment' })}
          intent={Intent.DANGER}
          onClick={handleDeleteInventoryAdjustment(adjustment)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Menu>
    ),
    [handleDeleteInventoryAdjustment, formatMessage],
  );

  const onRowContextMenu = useCallback(
    (cell) => actionMenuList(cell.row.original),
    [actionMenuList],
  );

  const columns = useMemo(
    () => [
      {
        id: 'date',
        Header: formatMessage({ id: 'date' }),
        accessor: (r) => moment(r.date).format('YYYY MMM DD'),
        width: 115,
        className: 'date',
      },
      {
        id: 'type',
        Header: formatMessage({ id: 'type' }),
        accessor: TypeAccessor,
        className: 'type',
        width: 100,
      },
      {
        id: 'reason',
        Header: formatMessage({ id: 'reason' }),
        accessor: 'reason',
        className: 'reason',
        width: 115,
      },
      {
        id: 'reference_no',
        Header: formatMessage({ id: 'reference_no' }),
        accessor: 'reference_no',
        className: 'reference_no',
        width: 100,
      },
      {
        id: 'publish',
        Header: formatMessage({ id: 'status' }),
        accessor: PublishAccessor,
        width: 95,
        className: 'publish',
      },
      {
        id: 'description',
        Header: formatMessage({ id: 'description' }),
        accessor: 'description',
        disableSorting: true,
        width: 85,
        className: 'description',
      },
      {
        id: 'created_at',
        Header: formatMessage({ id: 'created_at' }),
        accessor: (r) => moment(r.created_at).format('YYYY MMM DD'),
        width: 125,
        className: 'created_at',
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
      addInventoryAdjustmentTableQueries({
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
    [addInventoryAdjustmentTableQueries],
  );

  const handleSelectedRowsChange = useCallback(
    (selectedRows) => {
      onSelectedRowsChange &&
        onSelectedRowsChange(selectedRows.map((s) => s.original));
    },
    [onSelectedRowsChange],
  );

  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <DataTable
        columns={columns}
        data={inventoryAdjustments}
        onFetchData={handleDataTableFetchData}
        manualSortBy={true}
        selectionColumn={true}
        noInitialFetch={true}
        onSelectedRowsChange={handleSelectedRowsChange}
        rowContextMenu={onRowContextMenu}
        pagination={true}
        autoResetSortBy={false}
        autoResetPage={false}
        isLoading={isLoading}
        noResults={'There is no inventory adjustments transactions yet.'}
        // pagesCount={inventoryAdjustmentsPagination.pagesCount}
        // initialPageSize={inventoryAdjustmentsPagination.pageSize}
        // initialPageIndex={inventoryAdjustmentsPagination.page - 1}
      />
    </div>
  );
}

export default compose(
  withRouter,
  withDialogActions,
  withInventoryAdjustmentActions,
)(InventoryAdjustmentDataTable);
