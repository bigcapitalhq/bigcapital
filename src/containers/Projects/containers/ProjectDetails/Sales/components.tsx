import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import clsx from 'classnames';
import { CLASSES } from 'common/classes';
import { FormatDateCell, Icon, FormattedMessage as T } from 'components';
import { Menu, MenuItem, Intent } from '@blueprintjs/core';
import { safeCallback } from 'utils';

/**
 * Table actions cell.
 */
export function ActionMenu({ payload: { onDelete }, row: { original } }) {
  return (
    <Menu>
      <MenuItem
        text={intl.get('sales.action.delete')}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
}

export function useSalesColumns() {
  return React.useMemo(
    () => [
      {
        id: 'date',
        Header: intl.get('sales.column.date'),
        accessor: 'date',
        Cell: FormatDateCell,
        width: 120,
        className: 'date',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'type',
        Header: intl.get('sales.column.type'),
        accessor: 'type',
        width: 120,
        className: 'type',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'transaction_no',
        Header: intl.get('sales.column.transaction_no'),
        accessor: 'transaction_no',
        width: 120,
      },
      {
        id: 'due_date',
        Header: intl.get('sales.column.due_date'),
        accessor: 'due_date',
        Cell: FormatDateCell,
        width: 120,
        className: 'due_date',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'balance',
        Header: intl.get('sales.column.balance'),
        accessor: 'balance',
        width: 120,
        clickable: true,
        align: 'right',
        className: clsx(CLASSES.FONT_BOLD),
      },
      {
        id: 'total',
        Header: intl.get('sales.column.total'),
        accessor: 'total',
        align: 'right',
        width: 120,
        className: clsx(CLASSES.FONT_BOLD),
      },
      {
        id: 'status',
        Header: intl.get('sales.column.status'),
        accessor: 'status',
        width: 120,
        className: 'status',
        clickable: true,
      },
    ],
    [],
  );
}
