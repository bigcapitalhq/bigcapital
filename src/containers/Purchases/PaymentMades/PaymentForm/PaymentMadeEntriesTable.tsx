import React, { useCallback } from 'react';
import { FormattedMessage as T CloudLoadingIndicator } from '@/components';
import classNames from 'classnames';

import { CLASSES } from '@/common/classes';
import { DataTableEditable } from '@/components';
import { usePaymentMadeEntriesTableColumns } from './components';

import { usePaymentMadeInnerContext } from './PaymentMadeInnerProvider';
import { compose, updateTableCell } from '@/utils';
import { useFormikContext } from 'formik';

/**
 * Payment made items table.
 */
export default function PaymentMadeEntriesTable({
  onUpdateData,
  entries,
  currencyCode,
}) {
  // Payment made inner context.
  const { isNewEntriesFetching } = usePaymentMadeInnerContext();

  // Payment entries table columns.
  const columns = usePaymentMadeEntriesTableColumns();

  // Formik context.
  const {
    values: { vendor_id },
  } = useFormikContext();

  // Handle update data.
  const handleUpdateData = useCallback(
    (rowIndex, columnId, value) => {
      const newRows = compose(updateTableCell(rowIndex, columnId, value))(
        entries,
      );
      onUpdateData(newRows);
    },
    [onUpdateData, entries],
  );
  // Detarmines the right no results message before selecting vendor and aftering
  // selecting vendor id.
  const noResultsMessage = vendor_id ? (
    <T
      id={
        'there_is_no_payable_bills_for_this_vendor_that_can_be_applied_for_this_payment'
      }
    />
  ) : (
    <T id={'please_select_a_vendor_to_display_all_open_bills_for_it'} />
  );

  return (
    <CloudLoadingIndicator isLoading={isNewEntriesFetching}>
      <DataTableEditable
        progressBarLoading={isNewEntriesFetching}
        className={classNames(CLASSES.DATATABLE_EDITOR_ITEMS_ENTRIES)}
        columns={columns}
        data={entries}
        spinnerProps={false}
        payload={{
          errors: [],
          updateData: handleUpdateData,
          currencyCode,
        }}
        noResults={noResultsMessage}
      />
    </CloudLoadingIndicator>
  );
}
