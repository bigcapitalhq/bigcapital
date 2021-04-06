import React, { useCallback } from 'react';
import { CloudLoadingIndicator } from 'components';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import { DataTableEditable } from 'components';
import { usePaymentMadeEntriesTableColumns } from './components';

import { usePaymentMadeInnerContext } from './PaymentMadeInnerProvider';
import { compose, updateTableRow } from 'utils';
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
      const newRows = compose(updateTableRow(rowIndex, columnId, value))(
        entries,
      );
      onUpdateData(newRows);
    },
    [onUpdateData, entries],
  );

  // Detarmines the right no results message before selecting vendor and aftering
  // selecting vendor id.
  const noResultsMessage = vendor_id
    ? 'There is no payable bills for this vendor that can be applied for this payment'
    : 'Please select a vendor to display all open bills for it.';

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
        footer={true}
      />
    </CloudLoadingIndicator>
  );
}
