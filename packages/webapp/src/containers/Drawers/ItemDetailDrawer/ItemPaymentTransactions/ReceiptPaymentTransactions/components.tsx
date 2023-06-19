// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';

import clsx from 'classnames';
import { safeCallback } from '@/utils';
import { CLASSES } from '@/constants/classes';
import { Can, FormatDateCell, Icon } from '@/components';
import { SaleReceiptAction, AbilitySubject } from '@/constants/abilityOption';

/**
 * Table actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: { onEdit, onDelete },
}) {
  return (
    <Menu>
      <Can I={SaleReceiptAction.Edit} a={AbilitySubject.Receipt}>
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('invoice_transactions.action.edit_transaction')}
          onClick={safeCallback(onEdit, original)}
        />
      </Can>
      <Can I={SaleReceiptAction.Edit} a={AbilitySubject.Receipt}>
        <MenuDivider />
        <MenuItem
          text={intl.get('invoice_transactions.action.delete_transaction')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Can>
    </Menu>
  );
}

/**
 * Retrieve receipt transactions associated with item table columns.
 */
export const useReceiptTransactionsColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'receipt_date',
        Header: intl.get('date'),
        accessor: 'formatted_receipt_date',
        Cell: FormatDateCell,
        width: 120,
        className: 'receipt_date',
        textOverview: true,
      },
      {
        id: 'customer',
        Header: intl.get('customer'),
        accessor: 'customer_display_name',
        width: 140,
        className: 'customer',
        textOverview: true,
      },
      {
        id: 'receipt_number',
        Header: intl.get('receipt_no'),
        accessor: 'receip_number',
        width: 120,
        className: 'receipt_number',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'quantity',
        Header: intl.get('item.drawer_quantity_sold'),
        accessor: 'quantity',
        align: 'right',
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
