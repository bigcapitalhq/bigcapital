// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import clsx from 'classnames';
import { Intent, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { CLASSES } from '@/constants/classes';
import { FormatDateCell, Icon, Can } from '@/components';
import { safeCallback } from '@/utils';
import { PaymentReceiveAction, AbilitySubject } from '@/constants/abilityOption';

/**
 * Table actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: { onEdit, onDelete },
}) {
  return (
    <Menu>
      <Can I={PaymentReceiveAction.Edit} a={AbilitySubject.PaymentReceive}>
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('invoice_transactions.action.edit_transaction')}
          onClick={safeCallback(onEdit, original)}
        />
      </Can>
      <Can I={PaymentReceiveAction.Delete} a={AbilitySubject.PaymentReceive}>
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
 * Retrieve invoice payment transactions table columns.
 */
export const useInvoicePaymentTransactionsColumns = () => {
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
        id: 'deposit_account_name',
        Header: intl.get('invoice_transactions.column.withdrawal_account'),
        accessor: 'deposit_account_name',
        width: 120,
        textOverview: true,
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: 'formatted_payment_amount',
        align: 'right',
        width: 120,
        className: clsx(CLASSES.FONT_BOLD),
        textOverview: true,
      },
      {
        id: 'payment_number.',
        Header: intl.get('payment_no'),
        accessor: 'payment_number',
        width: 100,
        className: 'payment_number',
        textOverview: true,
      },
      {
        id: 'payment_reference_no',
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
