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
import { useIntl } from 'react-intl';
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
  payload: { onEdit, onDelete },
}) {
  const { formatMessage } = useIntl();

  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={formatMessage({ id: 'view_details' })}
      />
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={formatMessage({ id: 'edit_payment_made' })}
        onClick={safeCallback(onEdit, original)}
      />
      <MenuItem
        text={formatMessage({ id: 'delete_payment_made' })}
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
  const { formatMessage } = useIntl();

  return React.useMemo(
    () => [
      {
        id: 'payment_date',
        Header: formatMessage({ id: 'payment_date' }),
        Cell: DateCell,
        accessor: 'payment_date',
        width: 140,
        className: 'payment_date',
      },
      {
        id: 'vendor',
        Header: formatMessage({ id: 'vendor_name' }),
        accessor: 'vendor.display_name',
        width: 140,
        className: 'vendor_id',
      },
      {
        id: 'payment_number',
        Header: formatMessage({ id: 'payment_number' }),
        accessor: (row) =>
          row.payment_number ? `#${row.payment_number}` : null,
        width: 140,
        className: 'payment_number',
      },
      {
        id: 'payment_account',
        Header: formatMessage({ id: 'payment_account' }),
        accessor: 'payment_account.name',
        width: 140,
        className: 'payment_account_id',
      },
      {
        id: 'amount',
        Header: formatMessage({ id: 'amount' }),
        accessor: AmountAccessor,
        width: 140,
        className: 'amount',
      },
      {
        id: 'reference_no',
        Header: formatMessage({ id: 'reference' }),
        accessor: 'reference',
        width: 140,
        className: 'reference',
      },

      {
        id: 'actions',
        Header: '',
        Cell: ActionsCell,
        className: 'actions',
        width: 50,
        disableResizing: true,
      },
    ],
    [formatMessage],
  );
}
