import classNames from 'classnames';
import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { usePaymentMadeEntriesTableColumns } from './components';
import { usePaymentMadeInnerContext } from './PaymentMadeInnerProvider';
import type { PaymentMadeEntry, PaymentMadeFormValues } from './utils';
import {
  DataTableEditable,
  CloudLoadingIndicator,
  FormattedMessage as T,
} from '@/components';
import { CLASSES } from '@/constants/classes';
import { compose, updateTableCell } from '@/utils';

type PaymentMadeEntriesTableProps = {
  onUpdateData: (entries: PaymentMadeEntry[]) => void;
  entries: PaymentMadeEntry[];
  currencyCode: string;
};

/**
 * Payment made items table.
 */
export function PaymentMadeEntriesTable({
  onUpdateData,
  entries,
  currencyCode,
}: PaymentMadeEntriesTableProps) {
  // Payment made inner context.
  const { isNewEntriesFetching } = usePaymentMadeInnerContext();

  // Payment entries table columns.
  const columns = usePaymentMadeEntriesTableColumns();

  // Formik context.
  const {
    values: { vendorId },
    errors,
  } = useFormikContext<PaymentMadeFormValues>();

  // Handle update data.
  const handleUpdateData = useCallback(
    (rowIndex: number, columnId: string, value: unknown) => {
      const newRows = compose(updateTableCell(rowIndex, columnId, value))(
        entries,
      );
      onUpdateData(newRows);
    },
    [onUpdateData, entries],
  );
  // Detarmines the right no results message before selecting vendor and after
  // selecting vendor id.
  const noResultsMessage = vendorId ? (
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
      {/* @ts-expect-error DataTableEditable requires actions/name props not provided here */}
      <DataTableEditable
        progressBarLoading={isNewEntriesFetching}
        className={classNames(CLASSES.DATATABLE_EDITOR_ITEMS_ENTRIES)}
        columns={columns}
        data={entries}
        spinnerProps={false}
        payload={{
          errors: (errors?.entries || []) as unknown[],
          updateData: handleUpdateData,
          currencyCode,
        }}
        noResults={noResultsMessage}
      />
    </CloudLoadingIndicator>
  );
}
