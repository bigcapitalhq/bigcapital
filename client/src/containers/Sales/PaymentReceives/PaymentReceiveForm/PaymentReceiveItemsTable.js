import React, { useMemo, useCallback } from 'react';
import { Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { CloudLoadingIndicator } from 'components';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';
import { DataTableEditable } from 'components';
import { usePaymentReceiveEntriesColumns } from './components';

/**
 * Payment receive items table.
 */
export default function PaymentReceiveItemsTable() {
  // Payment receive form context.
  const {
    isNewMode,
    isDueInvoicesFetching,
    paymentCustomerId,
    dueInvoices,
  } = usePaymentReceiveFormContext();

  // Payment receive entries form context.
  const columns = usePaymentReceiveEntriesColumns();

  // Detarmines takes payment receive invoices entries from customer receivable
  // invoices or associated payment receive invoices.
  const computedTableData = useMemo(
    () => [
      ...(!isNewMode ? [] || [] : []),
      ...(isNewMode ? dueInvoices || [] : []),
    ],
    [isNewMode, dueInvoices],
  );

  // No results message.
  const noResultsMessage = paymentCustomerId
    ? 'There is no receivable invoices for this customer that can be applied for this payment'
    : 'Please select a customer to display all open invoices for it.';

  // Handle update data.
  const handleUpdateData = useCallback((rows) => {}, []);

  // Handle click clear all lines button.
  const handleClickClearAllLines = () => {
    
  };
 
  return (
    <CloudLoadingIndicator isLoading={isDueInvoicesFetching}>
      <DataTableEditable
        progressBarLoading={isDueInvoicesFetching}
        className={classNames(CLASSES.DATATABLE_EDITOR_ITEMS_ENTRIES)}
        columns={columns}
        data={[]}
        spinnerProps={false}
        payload={{
          errors: [],
          updateData: handleUpdateData,
        }}
        noResults={noResultsMessage}
        actions={
          <Button
            small={true}
            className={'button--secondary button--clear-lines'}
            onClick={handleClickClearAllLines}
          >
            <T id={'clear_all_lines'} />
          </Button>
        }
        totalRow={true}
      />
    </CloudLoadingIndicator>
  );
}
