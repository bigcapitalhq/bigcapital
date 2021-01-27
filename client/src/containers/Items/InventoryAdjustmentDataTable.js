import React, { useCallback, useMemo } from 'react';
import {
  Button,
  Popover,
  Menu,
  Intent,
  MenuItem,
  MenuDivider,
  Position,
  Tag,
} from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import moment from 'moment';
import classNames from 'classnames';
import { DataTable, Icon, LoadingIndicator } from 'components';
import { CLASSES } from 'common/classes';
import { useIsValuePassed } from 'hooks';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withInventoryAdjustments from './withInventoryAdjustments';
import withInventoryAdjustmentActions from './withInventoryAdjustmentActions';

import { compose, saveInvoke } from 'utils';
import { withRouter } from 'react-router-dom';

function InventoryAdjustmentDataTable({
  // withInventoryAdjustments
  inventoryAdjustmentItems,
  inventoryAdjustmentCurrentPage,
  inventoryAdjustmentLoading,
  inventoryAdjustmentsPagination,

  // withInventoryAdjustmentsActions
  addInventoryAdjustmentTableQueries,

  // #ownProps
  onDeleteInventoryAdjustment,
  onSelectedRowsChange,
}) {
  const { formatMessage } = useIntl();
  const isLoadedBefore = useIsValuePassed(inventoryAdjustmentLoading, false);

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
        accessor: (row) =>
          row.type ? (
            <Tag minimal={true} round={true} intent={Intent.NONE}>
              {formatMessage({ id: row.type })}
            </Tag>
          ) : (
            ''
          ),
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
        accessor: (r) => {
          return r.is_published ? (
            <Tag minimal={true}>
              <T id={'published'} />
            </Tag>
          ) : (
            <Tag minimal={true} intent={Intent.WARNING}>
              <T id={'draft'} />
            </Tag>
          );
        },
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
      <LoadingIndicator loading={inventoryAdjustmentLoading && !isLoadedBefore}>
        <DataTable
          columns={columns}
          data={inventoryAdjustmentItems}
          onFetchData={handleDataTableFetchData}
          manualSortBy={true}
          selectionColumn={true}
          noInitialFetch={true}
          onSelectedRowsChange={handleSelectedRowsChange}
          rowContextMenu={onRowContextMenu}
          pagination={true}
          autoResetSortBy={false}
          autoResetPage={false}
          pagesCount={inventoryAdjustmentsPagination.pagesCount}
          initialPageSize={inventoryAdjustmentsPagination.pageSize}
          initialPageIndex={inventoryAdjustmentsPagination.page - 1}
        />
      </LoadingIndicator>
    </div>
  );
}

export default compose(
  withRouter,
  withDialogActions,
  withInventoryAdjustmentActions,
  withInventoryAdjustments(
    ({
      inventoryAdjustmentLoading,
      inventoryAdjustmentItems,
      inventoryAdjustmentCurrentPage,
      inventoryAdjustmentsPagination,
    }) => ({
      inventoryAdjustmentLoading,
      inventoryAdjustmentItems,
      inventoryAdjustmentCurrentPage,
      inventoryAdjustmentsPagination,
    }),
  ),
)(InventoryAdjustmentDataTable);
