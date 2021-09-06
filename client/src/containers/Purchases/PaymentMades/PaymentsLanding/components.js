import React from 'react';
import moment from 'moment';
import {
  Intent,
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
} from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { Icon, Money } from 'components';
import { safeCallback } from 'utils';

export function DateCell({ value }) {
  return moment(value).format('YYYY MMM DD');
}

export function AmountAccessor(row) {
  return <Money amount={row.amount} currency={row.currency_code} />;
}

/**
 * Actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: { onEdit, onDelete, onViewDetails },
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
        text={intl.get('edit_payment_made')}
        onClick={safeCallback(onEdit, original)}
      />
      <MenuItem
        text={intl.get('delete_payment_made')}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
}

/**
 * Payment mades table actions cell.
 */
export function ActionsCell(props) {
  return (
    <Popover
      content={<ActionsMenu {...props} />}
      position={Position.RIGHT_BOTTOM}
    >
      <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
    </Popover>
  );
}

/**
 * Retrieve payment mades table columns.
 */
export function usePaymentMadesTableColumns() {
  return React.useMemo(
    () => [
      {
        id: 'payment_date',
        Header: intl.get('payment_date'),
        Cell: DateCell,
        accessor: 'payment_date',
        width: 140,
        className: 'payment_date',
        clickable: true,
      },
      {
        id: 'vendor',
        Header: intl.get('vendor_name'),
        accessor: 'vendor.display_name',
        width: 140,
        className: 'vendor_id',
        clickable: true,
      },
      {
        id: 'payment_number',
        Header: intl.get('payment_number'),
        accessor: (row) =>
          row.payment_number ? `#${row.payment_number}` : null,
        width: 140,
        className: 'payment_number',
        clickable: true,
      },
      {
        id: 'payment_account',
        Header: intl.get('payment_account'),
        accessor: 'payment_account.name',
        width: 140,
        className: 'payment_account_id',
        clickable: true,
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: AmountAccessor,
        width: 140,
        className: 'amount',
        clickable: true,
      },
      {
        id: 'reference_no',
        Header: intl.get('reference'),
        accessor: 'reference',
        width: 140,
        className: 'reference',
        clickable: true,
      },
    ],
    [],
  );
}
