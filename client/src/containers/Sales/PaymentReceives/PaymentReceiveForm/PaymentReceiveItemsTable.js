import React, { useCallback } from 'react';
import { CloudLoadingIndicator } from 'components';
import classNames from 'classnames';
import { useFormikContext } from 'formik';

import { CLASSES } from 'common/classes';
import { usePaymentReceiveInnerContext } from './PaymentReceiveInnerProvider';
import { DataTableEditable } from 'components';
import { usePaymentReceiveEntriesColumns } from './components';
import { compose, updateTableRow } from 'utils';

/**
 * Payment receive items table.
 */
export default function PaymentReceiveItemsTable({
  entries,
  onUpdateData,
  currencyCode
}) {
  // Payment receive form context.
  const {
    isDueInvoicesFetching,
  } = usePaymentReceiveInnerContext();

  // Payment receive entries form context.
  const columns = usePaymentReceiveEntriesColumns();

  // Formik context.
  const { values: { customer_id } } = useFormikContext();

  // No results message.
  const noResultsMessage = customer_id
    ? 'There is no receivable invoices for this customer that can be applied for this payment'
    : 'Please select a customer to display all open invoices for it.';

  // Handle update data.
  const handleUpdateData = useCallback((rowIndex, columnId, value) => {
    const newRows = compose(
      updateTableRow(rowIndex, columnId, value),
    )(entries);

    onUpdateData(newRows);
  }, [entries, onUpdateData]);

  return (
    <CloudLoadingIndicator isLoading={isDueInvoicesFetching}>
      <DataTableEditable
        progressBarLoading={isDueInvoicesFetching}
        className={classNames(CLASSES.DATATABLE_EDITOR_ITEMS_ENTRIES)}
        columns={columns}
        data={entries}
        spinnerProps={false}
        payload={{
          errors: [],
          updateData: handleUpdateData,
          currencyCode
        }}
        noResults={noResultsMessage}
        footer={true}
      />
    </CloudLoadingIndicator>
  );
}