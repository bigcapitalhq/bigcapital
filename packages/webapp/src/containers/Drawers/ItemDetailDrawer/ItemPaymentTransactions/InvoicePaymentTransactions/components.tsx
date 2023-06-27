// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';

import clsx from 'classnames';
import { CLASSES } from '@/constants/classes';
import { Can, FormatDateCell, Icon } from '@/components';
import { safeCallback } from '@/utils';
import { SaleInvoiceAction, AbilitySubject } from '@/constants/abilityOption';

/**
 * Table actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: { onEdit, onDelete },
}) {
  return (
    <Menu>
      <Can I={SaleInvoiceAction.Edit} a={AbilitySubject.Invoice}>
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('invoice_transactions.action.edit_transaction')}
          onClick={safeCallback(onEdit, original)}
        />
      </Can>
      <Can I={SaleInvoiceAction.Delete} a={AbilitySubject.Invoice}>
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
 * Retrieve invoice payment transactions associated with item table columns.
 */
export const useInvoicePaymentTransactionsColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'invoice_date',
        Header: intl.get('date'),
        accessor: 'formatted_invoice_date',
        Cell: FormatDateCell,
        width: 120,
        className: 'invoice_date',
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
        id: 'invoice_no',
        Header: intl.get('invoice_no__'),
        accessor: 'invoice_number',
        width: 120,
        className: 'invoice_no',
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
        Header: intl.get('rate'),
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
