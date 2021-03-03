import React from 'react';
import {
  Intent,
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
} from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import moment from 'moment';
import { Money, Icon } from 'components';
import { safeCallback } from 'utils';

/**
 * Table actions menu.
 */
export function ActionsMenu({
  row: { original: paymentReceive },
  payload: { onEdit, onDelete, onDrawer },
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
        text={formatMessage({ id: 'edit_payment_receive' })}
        onClick={safeCallback(onEdit, paymentReceive)}
      />
      <MenuItem
        icon={<Icon icon={'receipt-24'} iconSize={16} />}
        text={formatMessage({ id: 'payment_receive_paper' })}
        onClick={() => onDrawer()}
      />
      <MenuItem
        text={formatMessage({ id: 'delete_payment_receive' })}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, paymentReceive)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
}

/**
 * Amount accessor.
 */
export function AmountAccessor(row) {
  return <Money amount={row.amount} currency={'USD'} />;
}

/**
 * Payment date accessor.
 */
export function PaymentDateAccessor(row) {
  return moment(row.payment_date).format('YYYY MMM DD');
}

/**
 * Actions cell.
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
 * Retrieve payment receives columns.
 */
export function usePaymentReceivesColumns() {
  const { formatMessage } = useIntl();

  return React.useMemo(
    () => [
      {
        id: 'payment_date',
        Header: formatMessage({ id: 'payment_date' }),
        accessor: PaymentDateAccessor,
        width: 140,
        className: 'payment_date',
      },
      {
        id: 'customer',
        Header: formatMessage({ id: 'customer_name' }),
        accessor: 'customer.display_name',
        width: 160,
        className: 'customer_id',
      },
      {
        id: 'amount',
        Header: formatMessage({ id: 'amount' }),
        accessor: AmountAccessor,
        width: 120,
        className: 'amount',
      },
      {
        id: 'payment_receive_no',
        Header: formatMessage({ id: 'payment_receive_no' }),
        accessor: (row) =>
          row.payment_receive_no ? `#${row.payment_receive_no}` : null,
        width: 140,
        className: 'payment_receive_no',
      },
      {
        id: 'reference_no',
        Header: formatMessage({ id: 'reference_no' }),
        accessor: 'reference_no',
        width: 140,
        className: 'reference_no',
      },
      {
        id: 'deposit_account',
        Header: formatMessage({ id: 'deposit_account' }),
        accessor: 'deposit_account.name',
        width: 140,
        className: 'deposit_account_id',
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
