// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Tag, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { safeCallback } from '@/utils';
import {
  FormatDateCell,
  FormattedMessage as T,
  Choose,
  If,
  Icon,
} from '@/components';

export function ActionsMenu({
  payload: { onEdit, onDelete, onViewDetails, onInitiate, onTransfer },
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

      <If condition={!original.is_transferred && !original.is_initiated}>
        <MenuItem
          icon={<Icon icon={'check'} iconSize={18} />}
          text={intl.get('warehouse_transfer.action.initiate_transfer')}
          onClick={safeCallback(onInitiate, original)}
        />
      </If>
      <If condition={original.is_initiated && !original.is_transferred}>
        <MenuItem
          icon={<Icon icon="send" iconSize={16} />}
          text={intl.get('warehouse_transfer.action.mark_as_transferred')}
          onClick={safeCallback(onTransfer, original)}
        />
      </If>

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
 * Status accessor.
 */
export function StatusAccessor(warehouse) {
  return (
    <Choose>
      <Choose.When
        condition={warehouse.is_initiated && !warehouse.is_transferred}
      >
        <Tag minimal={true} intent={Intent.WARNING} round={true}>
          <T id={'warehouse_transfer.label.transfer_initiated'} />
        </Tag>
      </Choose.When>
      <Choose.When
        condition={warehouse.is_initiated && warehouse.is_transferred}
      >
        <Tag minimal={true} intent={Intent.SUCCESS} round={true}>
          <T id={'warehouse_transfer.label.transferred'} />
        </Tag>
      </Choose.When>

      <Choose.Otherwise>
        <Tag minimal={true} intent={Intent.NONE} round={true}>
          <T id={'draft'} />
        </Tag>
      </Choose.Otherwise>
    </Choose>
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
        accessor: StatusAccessor,
        width: 140,
        className: 'status',
        clickable: true,
      },
    ],
    [],
  );
}
