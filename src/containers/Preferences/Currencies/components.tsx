import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import {
  Menu,
  Popover,
  Button,
  Position,
  MenuItem,
  MenuDivider,
  Intent,
} from '@blueprintjs/core';
import { Icon } from '@/components';
import { safeCallback } from '@/utils';

/**
 * Row actions menu list.
 */
export function ActionMenuList({
  row: { original },
  payload: { onEditCurrency, onDeleteCurrency },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('edit_currency')}
        onClick={safeCallback(onEditCurrency, original)}
      />
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={intl.get('delete_currency')}
        onClick={safeCallback(onDeleteCurrency, original)}
        intent={Intent.DANGER}
      />
    </Menu>
  );
}

/**
 * Actions cell.
 */
export const ActionsCell = (props) => {
  return (
    <Popover
      position={Position.RIGHT_BOTTOM}
      content={<ActionMenuList {...props} />}
    >
      <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
    </Popover>
  );
};

export function useCurrenciesTableColumns() {
  return useMemo(
    () => [
      {
        Header: intl.get('currency_name'),
        accessor: 'currency_name',
        width: 150,
      },
      {
        Header: intl.get('currency_code'),
        accessor: 'currency_code',
        className: 'currency_code',
        width: 120,
      },
      {
        Header: intl.get('currency_sign'),
        width: 120,
        accessor: 'currency_sign',
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
    [],
  );
}
