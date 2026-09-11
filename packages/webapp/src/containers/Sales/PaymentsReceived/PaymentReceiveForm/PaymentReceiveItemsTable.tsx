import classNames from 'classnames';
import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';
import { usePaymentReceiveEntriesColumns } from './components';
import { usePaymentReceiveInnerContext } from './PaymentReceiveInnerProvider';
import type { PaymentReceiveEntry, PaymentReceiveFormValues } from './utils';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { CloudLoadingIndicator, FormattedMessage as T } from '@/components';
import { DataTableEditable } from '@/components';
import { CLASSES } from '@/constants/classes';
import { DRAWERS } from '@/constants/drawers';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { compose, updateTableCell } from '@/utils';

type PaymentReceiveItemsTableProps = WithDrawerActionsProps & {
  entries: PaymentReceiveEntry[];
  onUpdateData: (entries: PaymentReceiveEntry[]) => void;
  currencyCode: string;
};

/**
 * Payment receive items table.
 */
function PaymentReceiveItemsTableInner({
  entries,
  onUpdateData,
  currencyCode,

  // #withDrawerActions
  openDrawer,
}: PaymentReceiveItemsTableProps) {
  const { isDueInvoicesFetching } = usePaymentReceiveInnerContext();

  // Opens the invoice detail drawer of the given invoice.
  const handleViewInvoiceDetail = (invoiceId: number) => {
    openDrawer(DRAWERS.INVOICE_DETAILS, { invoiceId });
  };

  const columns = usePaymentReceiveEntriesColumns(handleViewInvoiceDetail);

  const {
    values: { customerId },
    errors,
  } = useFormikContext<PaymentReceiveFormValues>();

  const noResultsMessage = customerId ? (
    <T id={'there_is_no_receivable_invoices_for_this_customer'} />
  ) : (
    <T id={'please_select_a_customer_to_display_all_open_invoices_for_it'} />
  );

  const handleUpdateData = useCallback(
    (rowIndex: number, columnId: string, value: unknown) => {
      const newRows = compose(updateTableCell(rowIndex, columnId, value))(
        entries,
      ) as PaymentReceiveEntry[];

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
        payload={{
          errors:
            (errors as { entries?: unknown[] } | undefined)?.entries || [],
          updateData: handleUpdateData,
          currencyCode,
        }}
        noResults={noResultsMessage}
      />
    </CloudLoadingIndicator>
  );
}

export const PaymentReceiveItemsTable = compose(withDrawerActions)(
  PaymentReceiveItemsTableInner,
);
