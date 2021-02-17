import React, { useMemo } from 'react';
import {
  Menu,
  Popover,
  Button,
  Position,
  MenuItem,
  Intent,
} from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import { Icon } from 'components';
import { safeCallback } from 'utils';

/**
 * Row actions menu list.
 */
export function ActionMenuList({
  row: { original },
  payload: { onEditCurrency, onDeleteCurrency },
}) {
  const { formatMessage } = useIntl();
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={formatMessage({ id: 'edit_currency' })}
        onClick={safeCallback(onEditCurrency, original)}
      />
      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={formatMessage({ id: 'delete_currency' })}
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
  const { formatMessage } = useIntl();

  return useMemo(
    () => [
      {
        Header: formatMessage({ id: 'currency_name' }),
        accessor: 'currency_name',
        width: 150,
      },
      {
        Header: formatMessage({ id: 'currency_code' }),
        accessor: 'currency_code',
        className: 'currency_code',
        width: 120,
      },
      {
        Header: 'Currency sign',
        width: 120,
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
