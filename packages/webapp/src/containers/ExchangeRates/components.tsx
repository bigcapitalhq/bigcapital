// @ts-nocheck
import React, { useMemo } from 'react';
import moment from 'moment';
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
import { Icon, Money } from '@/components';
import { safeCallback } from '@/utils';

/**
 * Row actions menu list.
 */
export function ActionMenuList({
  row: { original },
  payload: { onEditExchangeRate, onDeleteExchangeRate },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('edit_exchange_rate')}
        onClick={safeCallback(onEditExchangeRate, original)}
      />
      <MenuDivider />
      <MenuItem
        text={intl.get('delete_exchange_rate')}
        intent={Intent.DANGER}
        onClick={safeCallback(onDeleteExchangeRate, original)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
}

/**
 * Table actions cell.
 */
export function TableActionsCell(props) {
  return (
    <Popover
      content={<ActionMenuList {...props} />}
      position={Position.RIGHT_TOP}
    >
      <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
    </Popover>
  );
}

export function useExchangeRatesTableColumns() {
  return useMemo(
    () => [
      {
        id: 'date',
        Header: intl.get('date'),
        accessor: (r) => moment(r.date).format('YYYY MMM DD'),
        width: 150,
      },
      {
        id: 'currency_code',
        Header: intl.get('currency_code'),
        accessor: 'currency_code',
        className: 'currency_code',
        width: 150,
      },
      {
        id: 'exchange_rate',
        Header: intl.get('exchange_rate'),
        accessor: (r) => (
          <Money amount={r.exchange_rate} currency={r.currency_code} />
        ),
        className: 'exchange_rate',
        width: 150,
      },
      {
        id: 'actions',
        Header: '',
        Cell: TableActionsCell,
        className: 'actions',
        width: 50,
      },
    ],
    [],
  );
}
