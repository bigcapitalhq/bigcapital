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
import intl from 'react-intl-universal';

import { Icon, Money, If } from 'components';
import { safeCallback, firstLettersArgs } from 'utils';

/**
 * Actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: {
    onEdit,
    onDelete,
    onDuplicate,
    onInactivate,
    onActivate,
    onViewDetails,
  },
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
        text={intl.get('edit_vendor')}
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
        text={intl.get('delete_vendor')}
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
  return React.useMemo(
    () => [
      {
        id: 'avatar',
        Header: '',
        accessor: AvatarAccessor,
        className: 'avatar',
        width: 45,
        disableResizing: true,
        disableSortBy: true,
        clickable: true,
      },
      {
        id: 'display_name',
        Header: intl.get('display_name'),
        accessor: 'display_name',
        className: 'display_name',
        width: 150,
        clickable: true,
      },
      {
        id: 'company_name',
        Header: intl.get('company_name'),
        accessor: 'company_name',
        className: 'company_name',
        width: 150,
        clickable: true,
      },
      {
        id: 'work_phone',
        Header: intl.get('work_phone'),
        accessor: PhoneNumberAccessor,
        className: 'work_phone',
        width: 100,
        clickable: true,
      },
      {
        id: 'balance',
        Header: intl.get('receivable_balance'),
        accessor: BalanceAccessor,
        align: 'right',
        width: 100,
        clickable: true,
      },
    ],
    [],
  );
}
