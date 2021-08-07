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
import { Icon, Money, If } from 'components';
import { safeCallback } from 'utils';
import { firstLettersArgs } from 'utils';
import intl from 'react-intl-universal';

/**
 * Actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: { onEdit, onDelete, onDuplicate, onInactivate, onActivate },
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
        text={intl.get('edit_customer')}
        onClick={safeCallback(onEdit, original)}
      />
      <MenuItem
        icon={<Icon icon="duplicate-16" />}
        text={intl.get('duplicate')}
        onClick={safeCallback(onDuplicate, original)}
      />
      <If condition={original.active}>
        <MenuItem
          text={intl.get('inactivate_item')}
          icon={<Icon icon="pause-16" iconSize={16} />}
          onClick={safeCallback(onInactivate, original)}
        />
      </If>
      <If condition={!original.active}>
        <MenuItem
          text={intl.get('activate_item')}
          icon={<Icon icon="play-16" iconSize={16} />}
          onClick={safeCallback(onActivate, original)}
        />
      </If>
      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={intl.get('delete_customer')}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
      />
    </Menu>
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
  return <div className={'work_phone'}>{row.work_phone}</div>;
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
  return useMemo(
    () => [
      {
        id: 'avatar',
        Header: '',
        accessor: AvatarCell,
        className: 'avatar',
        width: 45,
        disableResizing: true,
        disableSortBy: true,
      },
      {
        id: 'display_name',
        Header: intl.get('display_name'),
        accessor: 'display_name',
        className: 'display_name',
        width: 150,
      },
      {
        id: 'company_name',
        Header: intl.get('company_name'),
        accessor: 'company_name',
        className: 'company_name',
        width: 150,
      },
      {
        id: 'work_phone',
        Header: intl.get('work_phone'),
        accessor: PhoneNumberAccessor,
        className: 'phone_number',
        width: 100,
      },
      {
        id: 'balance',
        Header: intl.get('receivable_balance'),
        accessor: BalanceAccessor,
        className: 'receivable_balance',
        width: 100,
      },
    ],
    [],
  );
}
