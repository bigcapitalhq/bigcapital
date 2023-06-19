// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import * as R from 'ramda';
import clsx from 'classnames';
import { Callout, Intent, Classes } from '@blueprintjs/core';

import { CLASSES } from '@/constants/classes';
import { MoneyFieldCell, FormatDateCell, AppToaster, T } from '@/components';

export const transformErrors = (errors, { setErrors }) => {
  if (errors.some((e) => e.type === 'INVOICES_HAS_NO_REMAINING_AMOUNT')) {
    AppToaster.show({
      message:
        'The amount credit from the given invoice has no remaining amount.',
      intent: Intent.DANGER,
    });
  }
  if (
    errors.find((error) => error.type === 'CREDIT_NOTE_HAS_NO_REMAINING_AMOUNT')
  ) {
    AppToaster.show({
      message: 'The total amount bigger than from remaining credit note amount',
      intent: Intent.DANGER,
    });
  }
};

/**
 * Empty status callout.
 * @returns {React.JSX}
 */
export function EmptyStatuCallout() {
  return (
    <div className={Classes.DIALOG_BODY}>
      <Callout intent={Intent.PRIMARY}>
        <p>
          <T
            id={'reconcile_credit_note.alert.there_is_no_open_sale_invoices'}
          />
        </p>
      </Callout>
    </div>
  );
}

/**
 * Retrieves reconcile credit note table columns.
 * @returns
 */
export const useReconcileCreditNoteTableColumns = () => {
  return React.useMemo(
    () => [
      {
        Header: intl.get('invoice_date'),
        accessor: 'formatted_invoice_date',
        Cell: FormatDateCell,
        disableSortBy: true,
        width: '120',
      },
      {
        Header: intl.get('invoice_no'),
        accessor: 'invoice_no',
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
        Header: intl.get('reconcile_credit_note.column.remaining_amount'),
        accessor: 'formatted_due_amount',
        disableSortBy: true,
        align: 'right',
        width: '150',
        className: clsx(CLASSES.FONT_BOLD),
      },
      {
        Header: intl.get('reconcile_credit_note.column.amount_to_credit'),
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
 * Sets max credit amount from sale invoice balance.
 */
export const maxAmountCreditFromRemaining = (entries) => {
  return entries.map((entry) => ({
    ...entry,
    amount: entry.amount ? Math.min(entry.balance, entry.amount) : '',
  }));
};

/**
 * Adjusts entries amount based on the given total.
 */
export const maxCreditNoteAmountEntries = R.curry((total, entries) => {
  let balance = total;

  return entries.map((entry) => {
    const oldBalance = balance;
    balance -= entry.amount ? entry.amount : 0;

    return {
      ...entry,
      amount: entry.amount
        ? Math.max(Math.min(entry.amount, oldBalance), 0)
        : '',
    };
  });
});
