import React from 'react';
import {
  Intent,
  Menu,
  MenuItem,
  MenuDivider,
  Popover,
  Button,
  Position,
  Tag,
} from '@blueprintjs/core';
import { useIntl, FormattedMessage as T } from 'react-intl';
import { Icon, If, Choose, Money } from 'components';
import { safeCallback, isBlank } from 'utils';
import moment from 'moment';

/**
 * Actions menu.
 */
export function ActionsMenu({
  payload: { onEdit, onOpen, onDelete, onQuick },
  row: { original },
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
        text={formatMessage({ id: 'edit_bill' })}
        onClick={safeCallback(onEdit, original)}
      />

      <If condition={!original.is_open}>
        <MenuItem
          icon={<Icon icon={'check'} iconSize={18} />}
          text={formatMessage({ id: 'mark_as_opened' })}
          onClick={safeCallback(onOpen, original)}
        />
      </If>
      <If condition={original.is_open && !original.is_fully_paid}>
        <MenuItem
          icon={<Icon icon="quick-payment-16" iconSize={16} />}
          text={formatMessage({ id: 'add_payment' })}
          onClick={safeCallback(onQuick, original)}
        />
      </If>

      <MenuItem
        text={formatMessage({ id: 'delete_bill' })}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
}

/**
 * Amount accessor.
 */
export function AmountAccessor(bill) {
  return !isBlank(bill.amount) ? (
    <Money amount={bill.amount} currency={bill.currency_code} />
  ) : (
    ''
  );
}

/**
 * Status accessor.
 */
export function StatusAccessor(bill) {
  return (
    <Choose>
      <Choose.When condition={bill.is_open}>
        <Tag minimal={true} intent={Intent.SUCCESS}>
          <T id={'opened'} />
        </Tag>
      </Choose.When>

      <Choose.Otherwise>
        <Tag minimal={true}>
          <T id={'draft'} />
        </Tag>
      </Choose.Otherwise>
    </Choose>
  );
}

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
 * Retrieve bills table columns.
 */
export function useBillsTableColumns() {
  const { formatMessage } = useIntl();

  return React.useMemo(
    () => [
      {
        id: 'bill_date',
        Header: formatMessage({ id: 'bill_date' }),
        accessor: (r) => moment(r.bill_date).format('YYYY MMM DD'),
        width: 140,
        className: 'bill_date',
      },
      {
        id: 'vendor',
        Header: formatMessage({ id: 'vendor_name' }),
        accessor: 'vendor.display_name',
        width: 140,
        className: 'vendor',
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
        accessor: AmountAccessor,
        width: 140,
        className: 'amount',
      },
      {
        id: 'status',
        Header: formatMessage({ id: 'status' }),
        accessor: StatusAccessor,
        width: 140,
        className: 'status',
      },
      {
        id: 'reference_no',
        Header: formatMessage({ id: 'reference_no' }),
        accessor: 'reference_no',
        width: 140,
        className: 'reference_no',
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
