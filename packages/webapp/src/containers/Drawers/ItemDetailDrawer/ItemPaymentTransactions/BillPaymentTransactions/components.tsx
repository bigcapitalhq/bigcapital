import { Intent, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import type { ItemAssociatedBillsResponse } from '@bigcapital/sdk-ts';
import { Can, FormatDateCell, Icon } from '@/components';
import { BillAction, AbilitySubject } from '@/constants/abilityOption';
import { CLASSES } from '@/constants/classes';
import { safeCallback } from '@/utils';

export type ItemBillTransaction = ItemAssociatedBillsResponse[number];

interface ActionsMenuProps {
  row: { original: ItemBillTransaction };
  payload: {
    onEdit: (row: ItemBillTransaction) => void;
    onDelete: (row: ItemBillTransaction) => void;
  };
}

/**
 * Table actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: { onEdit, onDelete },
}: ActionsMenuProps) {
  return (
    <Menu>
      <Can I={BillAction.Edit} a={AbilitySubject.Bill}>
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('invoice_transactions.action.edit_transaction')}
          onClick={safeCallback(onEdit, original)}
        />
      </Can>
      <Can I={BillAction.Delete} a={AbilitySubject.Bill}>
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
 * Retrieve bill transactions associated with item table columns.
 */
export const useBillTransactionsColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'bill_date',
        Header: intl.get('date'),
        accessor: 'formattedBillDate',
        Cell: FormatDateCell,
        width: 120,
        className: 'bill_date',
      },
      {
        id: 'vendor',
        Header: intl.get('vendor'),
        accessor: 'vendorDisplayName',
        width: 140,
        className: 'vendor',
        textOverview: true,
      },
      {
        id: 'bill_number',
        Header: intl.get('bill_number'),
        accessor: (row: ItemBillTransaction) =>
          row.billNumber ? `${row.billNumber}` : null,
        width: 100,
        className: 'bill_number',
      },
      {
        id: 'qunatity',
        Header: intl.get('item.drawer_quantity_sold'),
        accessor: 'quantity',
        align: 'right',
        width: 100,
      },
      {
        id: 'rate',
        Header: 'Rate',
        accessor: 'formattedRate',
        align: 'right',
        width: 100,
        className: clsx(CLASSES.FONT_BOLD),
        textOverview: true,
      },
      {
        id: 'amount',
        Header: intl.get('total'),
        accessor: 'formattedAmount',
        align: 'right',
        width: 100,
        className: clsx(CLASSES.FONT_BOLD),
        textOverview: true,
      },
    ],
    [],
  );
};
