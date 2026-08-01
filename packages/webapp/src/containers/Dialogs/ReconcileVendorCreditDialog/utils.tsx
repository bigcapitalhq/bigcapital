import { Callout, Intent, Classes } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';
import intl from 'react-intl-universal';
import type { ReconcileVendorCreditFormEntry } from './types';
import { FormatDateCell, MoneyFieldCell, T } from '@/components';
import { CLASSES } from '@/constants/classes';

interface ResponseError {
  type: string;
}

interface TransformErrorsArgs {
  setErrors: (errors: Partial<Record<string, string>>) => void;
}

// FIXME: latent bug — `transformErrors` is a no-op (empty body). The original
// call site in ReconcileVendorCreditForm is also commented out. Preserved.
export const transformErrors = (
  _errors: ResponseError[],
  { setErrors }: TransformErrorsArgs,
) => {
  void setErrors;
};

export function EmptyStatuCallout(): React.ReactElement {
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
        accessor: 'formattedBillDate',
        Cell: FormatDateCell,
        disableSortBy: true,
        width: '120',
      },
      {
        Header: intl.get('reconcile_vendor_credit.column.bill_number'),
        accessor: 'billNumber',
        disableSortBy: true,
        width: '100',
      },
      {
        Header: intl.get('amount'),
        accessor: 'formattedAmount',
        disableSortBy: true,
        align: 'right',
        width: '100',
      },
      {
        Header: intl.get('reconcile_vendor_credit.column.remaining_amount'),
        accessor: 'formattedDueAmount',
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
export const maxAmountCreditFromRemaining = (
  entries: ReconcileVendorCreditFormEntry[],
): ReconcileVendorCreditFormEntry[] => {
  return entries.map((entry) => ({
    ...entry,
    amount: entry.amount
      ? Math.min((entry.dueAmount ?? 0) as number, entry.amount as number)
      : '',
  }));
};
