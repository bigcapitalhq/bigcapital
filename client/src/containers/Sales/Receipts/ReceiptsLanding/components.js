import React from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import {
  Position,
  Menu,
  MenuItem,
  MenuDivider,
  Intent,
  Popover,
  Tag,
  Button,
} from '@blueprintjs/core';
import { safeCallback } from 'utils';
import { Choose, Money, Icon, If } from 'components';
import moment from 'moment';

export function ActionsMenu({
  payload: { onEdit, onDelete, onClose, onDrawer },
  row: { original: receipt },
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
        text={formatMessage({ id: 'edit_receipt' })}
        onClick={safeCallback(onEdit, receipt)}
      />
      <If condition={!receipt.is_closed}>
        <MenuItem
          text={formatMessage({ id: 'mark_as_closed' })}
          onClick={safeCallback(onClose, receipt)}
        />
      </If>
      <MenuItem
        icon={<Icon icon={'receipt-24'} iconSize={16} />}
        text={formatMessage({ id: 'receipt_paper' })}
        onClick={() => onDrawer()}
      />
      <MenuItem
        text={formatMessage({ id: 'delete_receipt' })}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, receipt)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
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
 * Status accessor.
 */
export function StatusAccessor(receipt) {
  return (
    <Choose>
      <Choose.When condition={receipt.is_closed}>
        <Tag minimal={true} intent={Intent.SUCCESS}>
          <T id={'closed'} />
        </Tag>
      </Choose.When>

      <Choose.Otherwise>
        <Tag minimal={true} intent={Intent.WARNING}>
          <T id={'draft'} />
        </Tag>
      </Choose.Otherwise>
    </Choose>
  );
}

/**
 * Retrieve receipts table columns.
 */
export function useReceiptsTableColumns() {
  const { formatMessage } = useIntl();

  return React.useMemo(
    () => [
      {
        id: 'receipt_date',
        Header: formatMessage({ id: 'receipt_date' }),
        accessor: (r) => moment(r.receipt_date).format('YYYY MMM DD'),
        width: 140,
        className: 'receipt_date',
      },
      {
        id: 'customer',
        Header: formatMessage({ id: 'customer_name' }),
        accessor: 'customer.display_name',
        width: 140,
        className: 'customer_id',
      },
      {
        id: 'receipt_number',
        Header: formatMessage({ id: 'receipt_number' }),
        accessor: (row) =>
          row.receipt_number ? `#${row.receipt_number}` : null,
        width: 140,
        className: 'receipt_number',
      },
      {
        id: 'deposit_account',
        Header: formatMessage({ id: 'deposit_account' }),
        accessor: 'deposit_account.name',
        width: 140,
        className: 'deposit_account',
      },
      {
        id: 'amount',
        Header: formatMessage({ id: 'amount' }),
        accessor: (r) => <Money amount={r.amount} currency={'USD'} />,
        width: 140,
        className: 'amount',
      },
      {
        id: 'status',
        Header: formatMessage({ id: 'status' }),
        accessor: StatusAccessor,
        width: 140,
        className: 'amount',
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
