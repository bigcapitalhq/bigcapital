import React from 'react';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';
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
  payload: { onEdit, onDelete, onClose, onDrawer, onViewDetails, onPrint },
  row: { original: receipt },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, receipt)}
      />
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('edit_receipt')}
        onClick={safeCallback(onEdit, receipt)}
      />
      <If condition={!receipt.is_closed}>
        <MenuItem
          icon={<Icon icon={'check'} iconSize={18} />}
          text={intl.get('mark_as_closed')}
          onClick={safeCallback(onClose, receipt)}
        />
      </If>
      <MenuItem
        icon={<Icon icon={'print-16'} iconSize={16} />}
        text={intl.get('print')}
        onClick={safeCallback(onPrint, receipt)}
      />
      <MenuItem
        text={intl.get('delete_receipt')}
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
  return React.useMemo(
    () => [
      {
        id: 'receipt_date',
        Header: intl.get('receipt_date'),
        accessor: (r) => moment(r.receipt_date).format('YYYY MMM DD'),
        width: 140,
        className: 'receipt_date',
        clickable: true,
      },
      {
        id: 'customer',
        Header: intl.get('customer_name'),
        accessor: 'customer.display_name',
        width: 140,
        className: 'customer_id',
        clickable: true,
      },
      {
        id: 'receipt_number',
        Header: intl.get('receipt_number'),
        accessor: 'receipt_number',
        width: 140,
        className: 'receipt_number',
        clickable: true,
      },
      {
        id: 'deposit_account',
        Header: intl.get('deposit_account'),
        accessor: 'deposit_account.name',
        width: 140,
        className: 'deposit_account',
        clickable: true,
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: (r) => <Money amount={r.amount} currency={r.currency_code} />,
        width: 140,
        className: 'amount',
        clickable: true,
      },
      {
        id: 'status',
        Header: intl.get('status'),
        accessor: StatusAccessor,
        width: 140,
        className: 'status',
        clickable: true,
      },
      {
        id: 'reference_no',
        Header: intl.get('reference_no'),
        accessor: 'reference_no',
        width: 140,
        className: 'reference_no',
        clickable: true,
      },
    ],
    [],
  );
}
