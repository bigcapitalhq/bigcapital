import React from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Intent,
} from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import { Icon, Money } from 'components';
import { safeCallback, firstLettersArgs } from 'utils';

/**
 * Actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: { onEdit, onDelete, onDuplicate },
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
        text={formatMessage({ id: 'edit_vendor' })}
        onClick={safeCallback(onEdit, original)}
      />
      <MenuItem
        icon={<Icon icon="duplicate-16" />}
        text={formatMessage({ id: 'duplicate' })}
        onClick={safeCallback(onDuplicate, original)}
      />
      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={formatMessage({ id: 'delete_vendor' })}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
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
 * Avatar table accessor.
 */
export function AvatarAccessor(row) {
  return <span className="avatar">{firstLettersArgs(row.display_name)}</span>;
}

/**
 * Phone number accessor.
 */
export function PhoneNumberAccessor(row) {
  return <div className={'work_phone'}>{row.work_phone}</div>;
}

/**
 * Balance accessor.
 */
export function BalanceAccessor({ closing_balance, currency_code }) {
  return <Money amount={closing_balance} currency={currency_code} />;
}

/**
 * Retrieve the vendors table columns.
 */
export function useVendorsTableColumns() {
  const { formatMessage } = useIntl();

  return React.useMemo(
    () => [
      {
        id: 'avatar',
        Header: '',
        accessor: AvatarAccessor,
        className: 'avatar',
        width: 50,
        disableResizing: true,
        disableSortBy: true,
      },
      {
        id: 'display_name',
        Header: formatMessage({ id: 'display_name' }),
        accessor: 'display_name',
        className: 'display_name',
        width: 150,
      },
      {
        id: 'company_name',
        Header: formatMessage({ id: 'company_name' }),
        accessor: 'company_name',
        className: 'company_name',
        width: 150,
      },
      {
        id: 'work_phone',
        Header: formatMessage({ id: 'work_phone' }),
        accessor: PhoneNumberAccessor,
        className: 'work_phone',
        width: 100,
      },
      {
        id: 'balance',
        Header: formatMessage({ id: 'receivable_balance' }),
        accessor: BalanceAccessor,
        className: 'receivable_balance',
        width: 100,
      },
      {
        id: 'actions',
        Cell: ActionsCell,
        className: 'actions',
        width: 70,
        disableResizing: true,
        disableSortBy: true,
      },
    ],
    [formatMessage],
  );
}
