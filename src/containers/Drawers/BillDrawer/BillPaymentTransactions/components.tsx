// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import clsx from 'classnames';
import { Intent, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { safeCallback } from '@/utils';
import { Can, FormatDateCell, Icon } from '@/components';
import { CLASSES } from '@/constants/classes';
import { PaymentMadeAction, AbilitySubject } from '@/constants/abilityOption';

/**
 * Table actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: { onEdit, onDelete },
}) {
  return (
    <Menu>
      <Can I={PaymentMadeAction.Edit} a={AbilitySubject.PaymentMade}>
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('invoice_transactions.action.edit_transaction')}
          onClick={safeCallback(onEdit, original)}
        />
      </Can>
      <Can I={PaymentMadeAction.Delete} a={AbilitySubject.PaymentMade}>
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
 * Retrieve bill payment transactions table columns.
 */
export const useBillPaymentTransactionsColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'date',
        Header: intl.get('payment_date'),
        accessor: 'formatted_payment_date',
        Cell: FormatDateCell,
        width: 110,
        className: 'date',
        textOverview: true,
      },
      {
        id: 'payment_account_name',
        Header: intl.get('bill_transactions.column.deposit_account'),
        accessor: 'payment_account_name',
        width: 120,
        textOverview: true,
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: 'formatted_payment_amount',
        align: 'right',
        width: 100,
        className: clsx(CLASSES.FONT_BOLD),
        textOverview: true,
      },
      {
        id: 'payment_number',
        Header: intl.get('payment_no'),
        accessor: 'payment_number',
        width: 100,
        className: 'payment_number',
      },
      {
        id: 'reference',
        Header: intl.get('reference_no'),
        accessor: 'payment_reference_no',
        width: 90,
        className: 'payment_reference_no',
        clickable: true,
        textOverview: true,
      },
    ],
    [],
  );
};
