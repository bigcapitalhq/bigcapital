import React, { useMemo } from 'react';
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Intent,
} from '@blueprintjs/core';
import { Icon, Money } from 'components';
import { safeCallback } from 'utils';
import { firstLettersArgs } from 'utils';
import { useIntl } from 'react-intl';

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
        text={formatMessage({ id: 'edit_customer' })}
        onClick={safeCallback(onEdit, original)}
      />
      <MenuItem
        icon={<Icon icon="duplicate-18" />}
        text={formatMessage({ id: 'duplicate' })}
        onClick={safeCallback(onDuplicate, original)}
      />
      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={formatMessage({ id: 'delete_customer' })}
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
 * Avatar cell.
 */
export function AvatarCell(row) {
  return <span className="avatar">{firstLettersArgs(row.display_name)}</span>;
}

/**
 * Phone number accessor.
 */
export function PhoneNumberAccessor(row) {
  return (
    <div>
      <div className={'work_phone'}>{row.work_phone}</div>
      <div className={'personal_phone'}>{row.personal_phone}</div>
    </div>
  );
}

/**
 * Balance accessor.
 */
export function BalanceAccessor(row) {
  return <Money amount={row.closing_balance} currency={row.currency_code} />;
}

/**
 * Retrieve customers table columns.
 */
export function useCustomersTableColumns() {
  const { formatMessage } = useIntl();

  return useMemo(
    () => [
      {
        id: 'avatar',
        Header: '',
        accessor: AvatarCell,
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
        id: 'phone_number',
        Header: formatMessage({ id: 'phone_number' }),
        accessor: PhoneNumberAccessor,
        className: 'phone_number',
        width: 100,
      },
      {
        id: 'receivable_balance',
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
