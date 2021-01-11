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
import { FormattedMessage as T, useIntl } from 'react-intl';
import moment from 'moment';
import classNames from 'classnames';
import {
  DataTable,
  If,
  Money,
  Choose,
  Icon,
  LoadingIndicator,
} from 'components';
import { CLASSES } from 'common/classes';
import { useIsValuePassed } from 'hooks';

import withDialogActions from 'containers/Dialog/withDialogActions';
// withInventoryAdjustments
// withInventoryAdjustmentsActions

import { compose, saveInvoke } from 'utils';
import { withRouter } from 'react-router-dom';

function InventoryAdjustmentDataTable({
  // #ownProps
  onDeleteInventoryAdjustment,
  onSelectedRowsChange,
}) {
  const { formatMessage } = useIntl();

  const handleDeleteInventoryAdjustment = useCallback(
    (_inventory) => {
      saveInvoke(onDeleteInventoryAdjustment, _inventory);
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
          icon={<Icon icon="trash-16" iconSize={16} />}
          intent={Intent.DANGER}
          onClick={handleDeleteInventoryAdjustment(adjustment)}
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
        accessor: 'type',
        className: 'type',
        width: 100,
      },
      {
        id: 'reason',
        Header: formatMessage({ id: 'reason' }),
        // accessor: (r) => (
        //   <Tooltip
        //     content={}
        //     position={Position.RIGHT_BOTTOM}
        //   >
        //   </Tooltip>
        // ),
        className: 'reason',
        width: 115,
      },
      {
        id: 'reference',
        Header: formatMessage({ id: 'reference' }),
        accessor: (row) => `#${row.reference}`,
        className: 'reference',
        width: 100,
      },
      {
        id: 'status',
        Header: formatMessage({ id: 'status' }),
        accessor: 'status',
        width: 95,
        className: 'status',
      },

      {
        id: 'description',
        Header: formatMessage({ id: 'description' }),
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

  const handleSelectedRowsChange = useCallback(
    (selectedRows) => {
      saveInvoke(
        onSelectedRowsChange,
        selectedRows.map((s) => s.original),
      );
    },
    [onSelectedRowsChange],
  );

  // const showEmptyStatus = [

  // ].every((condition) => condition === true);

  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>
      <LoadingIndicator

      // loading={}
      >
        <DataTable noInitialFetch={true} columns={columns} data={[]} />
      </LoadingIndicator>
    </div>
  );
}

export default compose(
  withRouter,
  withDialogActions,
)(InventoryAdjustmentDataTable);
