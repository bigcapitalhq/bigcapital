import React from 'react';
import {
  Intent,
  Tag,
  Menu,
  MenuItem,
  MenuDivider,
  ProgressBar,
} from '@blueprintjs/core';
import intl from 'react-intl-universal';
import clsx from 'classnames';
import { CLASSES } from '../../../common/classes';
import { safeCallback } from 'utils';
import {
  FormatDateCell,
  FormattedMessage as T,
  AppToaster,
  Choose,
  If,
  Icon,
  Can,
} from 'components';

export function ActionsMenu({
  payload: { onEdit, onDelete, onViewDetails, onPrint },
  row: { original },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, original)}
      />
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('warehouse_transfer.action.edit_warehouse_transfer')}
        onClick={safeCallback(onEdit, original)}
      />
      <MenuDivider />
      <MenuItem
        text={intl.get('warehouse_transfer.action.delete_warehouse_transfer')}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
}

/**
 * Retrieve warehouse transfer table columns.
 */
export function useWarehouseTransfersTableColumns() {
  return React.useMemo(
    () => [
      {
        id: 'date',
        Header: intl.get('date'),
        accessor: 'formatted_date',
        Cell: FormatDateCell,
        width: 120,
        className: 'date',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'transaction_number',
        Header: intl.get('warehouse_transfer.column.transfer_no'),
        accessor: 'transaction_number',
        width: 100,
        className: 'transaction_number',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'from_warehouse',
        Header: intl.get('warehouse_transfer.column.from_warehouse'),
        accessor: 'from_warehouse.name',
        width: 140,
        className: 'from_warehouse',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'to_warehouse',
        Header: intl.get('warehouse_transfer.column.to_warehouse'),
        accessor: 'to_warehouse.name',
        width: 140,
        className: 'to_warehouse',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'status',
        Header: intl.get('status'),
        // accessor: (row) => statusAccessor(row),
        width: 140,
        className: 'status',
        clickable: true,
      },
      {
        id: 'created_at',
        Header: intl.get('created_at'),
        accessor: 'created_at',
        Cell: FormatDateCell,
        width: 120,
        clickable: true,
      },
    ],
    [],
  );
}
