import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Menu, MenuItem } from '@blueprintjs/core';

import clsx from 'classnames';
import { CLASSES } from '../../../../../common/classes';
import { FormatDateCell, Icon } from '../../../../../components';
import { safeCallback } from 'utils';

/**
 * Table actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: { onEdit, onDelete },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('invoice_transactions.action.edit_transaction')}
        onClick={safeCallback(onEdit, original)}
      />
      <MenuItem
        text={intl.get('invoice_transactions.action.delete_transaction')}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
}

/**
 * Retrieve bill transactions associated with item table columns.
 */
export const useBillTransactionsColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'bill_date',
        Header: intl.get('date'),
        accessor: 'formatted_bill_date',
        Cell: FormatDateCell,
        width: 120,
        className: 'bill_date',
      },
      {
        id: 'vendor',
        Header: intl.get('vendor'),
        accessor: 'vendor_display_name',
        width: 140,
        className: 'vendor',
        textOverview: true,
      },
      {
        id: 'bill_number',
        Header: intl.get('bill_number'),
        accessor: (row) => (row.bill_number ? `${row.bill_number}` : null),
        width: 100,
        className: 'bill_number',
      },
      {
        id: 'qunatity',
        Header: intl.get('item.drawer_quantity_sold'),
        accessor: 'quantity',
        width: 100,
      },
      {
        id: 'rate',
        Header: 'Rate',
        accessor: 'formatted_rate',
        align: 'right',
        width: 100,
        className: clsx(CLASSES.FONT_BOLD),
        textOverview: true,
      },
      {
        id: 'amount',
        Header: intl.get('total'),
        accessor: 'formatted_amount',
        align: 'right',
        width: 100,
        className: clsx(CLASSES.FONT_BOLD),
        textOverview: true,
      },
    ],
    [],
  );
};
