import React from 'react';
import intl from 'react-intl-universal';
import { Callout, Intent, Classes } from '@blueprintjs/core';
import clsx from 'classnames';

import { CLASSES } from 'common/classes';
import { MoneyFieldCell, FormatDateCell,  AppToaster, T } from 'components';

export const transformErrors = (errors, { setErrors }) => {
  if (errors.some((e) => e.type === 'INVOICES_HAS_NO_REMAINING_AMOUNT')) {
    AppToaster.show({
      message: 'INVOICES_HAS_NO_REMAINING_AMOUNT',
      intent: Intent.DANGER,
    });
  }

  if (
    errors.find((error) => error.type === 'CREDIT_NOTE_HAS_NO_REMAINING_AMOUNT')
  ) {
    AppToaster.show({
      message: 'CREDIT_NOTE_HAS_NO_REMAINING_AMOUNT',
      intent: Intent.DANGER,
    });
  }
};

export function EmptyStatuCallout() {
  return (
    <div className={Classes.DIALOG_BODY}>
      <Callout intent={Intent.PRIMARY}>
        <p>
          <T id={'reconcile_credit_note.alert.there_is_no_open_sale_invoices'} />
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
  )
}