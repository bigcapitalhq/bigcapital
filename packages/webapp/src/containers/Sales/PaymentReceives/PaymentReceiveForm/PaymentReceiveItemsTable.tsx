// @ts-nocheck
import React, { useCallback } from 'react';
import classNames from 'classnames';
import { CloudLoadingIndicator } from '@/components';
import { useFormikContext } from 'formik';
import { FormattedMessage as T } from '@/components';

import { CLASSES } from '@/constants/classes';
import { usePaymentReceiveInnerContext } from './PaymentReceiveInnerProvider';
import { DataTableEditable } from '@/components';
import { usePaymentReceiveEntriesColumns } from './components';
import { compose, updateTableCell } from '@/utils';

/**
 * Payment receive items table.
 */
export default function PaymentReceiveItemsTable({
  entries,
  onUpdateData,
  currencyCode,
}) {
  // Payment receive form context.
  const { isDueInvoicesFetching } = usePaymentReceiveInnerContext();

  // Payment receive entries form context.
  const columns = usePaymentReceiveEntriesColumns();

  // Formik context.
  const {
    values: { customer_id },
    errors,
  } = useFormikContext();

  // No results message.
  const noResultsMessage = customer_id ? (
    <T id={'there_is_no_receivable_invoices_for_this_customer'} />
  ) : (
    <T id={'please_select_a_customer_to_display_all_open_invoices_for_it'} />
  );

  // Handle update data.
  const handleUpdateData = useCallback(
    (rowIndex, columnId, value) => {
      const newRows = compose(updateTableCell(rowIndex, columnId, value))(
        entries,
      );

      onUpdateData(newRows);
    },
    [entries, onUpdateData],
  );

  return (
    <CloudLoadingIndicator isLoading={isDueInvoicesFetching}>
      <DataTableEditable
        progressBarLoading={isDueInvoicesFetching}
        className={classNames(CLASSES.DATATABLE_EDITOR_ITEMS_ENTRIES)}
        columns={columns}
        data={entries}
        spinnerProps={false}
        payload={{
          errors: errors?.entries || [],
          updateData: handleUpdateData,
          currencyCode,
        }}
        noResults={noResultsMessage}
      />
    </CloudLoadingIndicator>
  );
}
