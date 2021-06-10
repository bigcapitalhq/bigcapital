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
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';
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
  

  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
      />
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('edit_payment_receive')}
        onClick={safeCallback(onEdit, paymentReceive)}
      />
      <MenuItem
        icon={<Icon icon={'receipt-24'} iconSize={16} />}
        text={intl.get('payment_receive_paper')}
        onClick={safeCallback(onDrawer, paymentReceive)}
      />
      <MenuItem
        text={intl.get('delete_payment_receive')}
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
  return <Money amount={row.amount} currency={row.currency_code} />;
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
  

  return React.useMemo(
    () => [
      {
        id: 'payment_date',
        Header: intl.get('payment_date'),
        accessor: PaymentDateAccessor,
        width: 140,
        className: 'payment_date',
      },
      {
        id: 'customer',
        Header: intl.get('customer_name'),
        accessor: 'customer.display_name',
        width: 160,
        className: 'customer_id',
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: AmountAccessor,
        width: 120,
        className: 'amount',
      },
      {
        id: 'payment_receive_no',
        Header: intl.get('payment_receive_no'),
        accessor: (row) =>
          row.payment_receive_no ? `#${row.payment_receive_no}` : null,
        width: 140,
        className: 'payment_receive_no',
      },
      {
        id: 'deposit_account',
        Header: intl.get('deposit_account'),
        accessor: 'deposit_account.name',
        width: 140,
        className: 'deposit_account_id',
      },
      {
        id: 'reference_no',
        Header: intl.get('reference_no'),
        accessor: 'reference_no',
        width: 140,
        className: 'reference_no',
      }
    ],
    [],
  );
}
