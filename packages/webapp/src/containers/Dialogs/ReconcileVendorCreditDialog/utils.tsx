// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import clsx from 'classnames';
import { Callout, Intent, Classes } from '@blueprintjs/core';

import { CLASSES } from '@/constants/classes';
import {T , MoneyFieldCell, FormatDateCell } from '@/components';

export const transformErrors = (errors, { setErrors }) => {};

export function EmptyStatusCallout() {
  return (
    <div className={Classes.DIALOG_BODY}>
      <Callout intent={Intent.PRIMARY}>
        <p>
          <T id={'reconcile_vendor_credit.alert.there_is_no_open_bills'} />
        </p>
      </Callout>
    </div>
  );
}

/**
 * Reconcile vendor credit table columns.
 */
export const useReconcileVendorCreditTableColumns = () => {
  return React.useMemo(
    () => [
      {
        Header: intl.get('bill_date'),
        accessor: 'formatted_bill_date',
        Cell: FormatDateCell,
        disableSortBy: true,
        width: '120',
      },
      {
        Header: intl.get('reconcile_vendor_credit.column.bill_number'),
        accessor: 'bill_number',
        disableSortBy: true,
        width: '100',
      },
      {
        Header: intl.get('amount'),
        accessor: 'formatted_amount',
        disableSortBy: true,
        align: 'right',
        width: '100',
      },
      {
        Header: intl.get('reconcile_vendor_credit.column.remaining_amount'),
        accessor: 'formatted_due_amount',
        disableSortBy: true,
        align: 'right',
        width: '150',
        className: clsx(CLASSES.FONT_BOLD),
      },
      {
        Header: intl.get('reconcile_vendor_credit.column.amount_to_credit'),
        accessor: 'amount',
        Cell: MoneyFieldCell,
        disableSortBy: true,
        width: '150',
      },
    ],
    [],
  );
};

/**
 * Sets max amount credit from purchase due amount.
 */
export const maxAmountCreditFromRemaining = (entries) => {
  return entries.map((entry) => ({
    ...entry,
    amount: entry.amount ? Math.min(entry.due_amount, entry.amount) : '',
  }));
};
