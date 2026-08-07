import { Intent, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import type { BillPaymentTransactionsResponse } from '@bigcapital/sdk-ts';
import { Can, FormatDateCell, Icon } from '@/components';
import { PaymentMadeAction, AbilitySubject } from '@/constants/abilityOption';
import { CLASSES } from '@/constants/classes';
import { safeCallback } from '@/utils';

type BillPaymentTransaction = BillPaymentTransactionsResponse[number];

interface ActionsMenuProps {
  row: { original: BillPaymentTransaction };
  payload: {
    onEdit: (row: BillPaymentTransaction) => void;
    onDelete: (row: BillPaymentTransaction) => void;
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
        accessor: 'formattedPaymentDate',
        Cell: FormatDateCell,
        width: 110,
        className: 'date',
        textOverview: true,
      },
      {
        id: 'payment_account_name',
        Header: intl.get('bill_transactions.column.deposit_account'),
        accessor: 'paymentAccountName',
        width: 120,
        textOverview: true,
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: 'formattedPaymentAmount',
        align: 'right',
        width: 100,
        className: clsx(CLASSES.FONT_BOLD),
        textOverview: true,
      },
      {
        id: 'payment_number',
        Header: intl.get('payment_no'),
        accessor: 'paymentNumber',
        width: 100,
        className: 'payment_number',
      },
      {
        id: 'reference',
        Header: intl.get('reference_no'),
        accessor: 'paymentReferenceNo',
        width: 90,
        className: 'payment_reference_no',
        clickable: true,
        textOverview: true,
      },
    ],
    [],
  );
};
