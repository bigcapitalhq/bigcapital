import React, { useCallback } from 'react';
import { Button } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { CloudLoadingIndicator } from 'components';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';
import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';
import { DataTableEditable } from 'components';
import { usePaymentReceiveEntriesColumns } from './components';
import { compose, updateTableRow, safeSumBy } from 'utils';
import withAlertActions from 'containers/Alert/withAlertActions';


/**
 * Payment receive items table.
 */
function PaymentReceiveItemsTable({
  entries,
  onUpdateData,

  // #withDialogActions
  openAlert
}) {
  // Payment receive form context.
  const {
    isDueInvoicesFetching,
    paymentCustomerId,
  } = usePaymentReceiveFormContext();

  // Payment receive entries form context.
  const columns = usePaymentReceiveEntriesColumns();

  // No results message.
  const noResultsMessage = paymentCustomerId
    ? 'There is no receivable invoices for this customer that can be applied for this payment'
    : 'Please select a customer to display all open invoices for it.';

  // Handle update data.
  const handleUpdateData = useCallback((rowIndex, columnId, value) => {
    const newRows = compose(
      updateTableRow(rowIndex, columnId, value),
    )(entries);

    onUpdateData(newRows);
  }, [entries, onUpdateData]);

  // Handle click clear all lines button.
  const handleClickClearAllLines = () => {
    const fullAmount = safeSumBy(entries, 'payment_amount');

    if (fullAmount > 0) {
      openAlert('clear-all-lines-payment-receive');
    }
  };
 
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

export default compose(withAlertActions)(PaymentReceiveItemsTable);