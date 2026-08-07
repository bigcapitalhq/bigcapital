import { Intent, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import type { ItemAssociatedEstimatesResponse } from '@bigcapital/sdk-ts';
import { Can, FormatDateCell, Icon } from '@/components';
import { SaleEstimateAction, AbilitySubject } from '@/constants/abilityOption';
import { CLASSES } from '@/constants/classes';
import { safeCallback } from '@/utils';

export type ItemEstimateTransaction = ItemAssociatedEstimatesResponse[number];

interface ActionsMenuProps {
  row: { original: ItemEstimateTransaction };
  payload: {
    onEdit: (row: ItemEstimateTransaction) => void;
    onDelete: (row: ItemEstimateTransaction) => void;
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
      <Can I={SaleEstimateAction.Edit} a={AbilitySubject.Estimate}>
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('invoice_transactions.action.edit_transaction')}
          onClick={safeCallback(onEdit, original)}
        />
      </Can>
      <Can I={SaleEstimateAction.Delete} a={AbilitySubject.Estimate}>
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
 * Retrieve estimate transactions associated with item table columns.
 */
export const useEstimateTransactionsColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'estimate_date',
        Header: intl.get('date'),
        accessor: 'formattedEstimateDate',
        Cell: FormatDateCell,
        width: 120,
        className: 'estimate_date',
        textOverview: true,
      },
      {
        id: 'customer',
        Header: intl.get('customer'),
        accessor: 'customerDisplayName',
        width: 140,
        className: 'customer',
        textOverview: true,
      },
      {
        id: 'estimate_number',
        Header: intl.get('estimate_no'),
        accessor: 'estimateNumber',
        width: 120,
        className: 'estimate_number',
        textOverview: true,
      },
      {
        id: 'qunatity',
        Header: intl.get('item.drawer_quantity_sold'),
        accessor: 'formattedQuantity',
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
