import React, { useMemo } from 'react';
import {
  Menu,
  Popover,
  Button,
  Position,
  MenuItem,
  MenuDivider,
  Intent,
} from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import { Icon, Money } from 'components';
import moment from 'moment';
import { safeCallback } from 'utils';

/**
 * Row actions menu list.
 */
export function ActionMenuList({
  row: { original },
  payload: { onEditExchangeRate, onDeleteExchangeRate },
}) {
  const { formatMessage } = useIntl();

  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={formatMessage({ id: 'edit_exchange_rate' })}
        onClick={safeCallback(onEditExchangeRate, original)}
      />
      <MenuDivider />
      <MenuItem
        text={formatMessage({ id: 'delete_exchange_rate' })}
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
  const { formatMessage } = useIntl();

  return useMemo(
    () => [
      {
        id: 'date',
        Header: formatMessage({ id: 'date' }),
        accessor: (r) => moment(r.date).format('YYYY MMM DD'),
        width: 150,
      },
      {
        id: 'currency_code',
        Header: formatMessage({ id: 'currency_code' }),
        accessor: 'currency_code',
        className: 'currency_code',
        width: 150,
      },
      {
        id: 'exchange_rate',
        Header: formatMessage({ id: 'exchange_rate' }),
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
    [formatMessage],
  );
}
