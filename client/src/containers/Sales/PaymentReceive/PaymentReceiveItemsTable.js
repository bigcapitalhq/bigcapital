import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { CloudLoadingIndicator } from 'components';
import { useQuery } from 'react-query';
import { omit } from 'lodash';

import { compose } from 'utils';

import withInvoices from '../Invoice/withInvoices';
import PaymentReceiveItemsTableEditor from './PaymentReceiveItemsTableEditor';
import withInvoiceActions from 'containers/Sales/Invoice/withInvoiceActions';


function PaymentReceiveItemsTable({
  // #ownProps
  paymentReceiveId,
  customerId,
  fullAmount,
  onUpdateData, 
  paymentReceiveEntries = [],
  errors,
  onClickClearAllLines,
  onFetchEntriesSuccess,

  // #withInvoices
  customerInvoiceEntries,

  // #withPaymentReceiveActions
  requestFetchDueInvoices
}) {
  const isNewMode = !paymentReceiveId;

  // Detarmines takes payment receive invoices entries from customer receivable
  // invoices or associated payment receive invoices.
  const computedTableData = useMemo(() => [
    ...(!isNewMode ? (paymentReceiveEntries || []) : []),
    ...(isNewMode ? (customerInvoiceEntries || []) : []), 
  ], [
    isNewMode,
    paymentReceiveEntries,
    customerInvoiceEntries,
  ]);

  const [tableData, setTableData] = useState(computedTableData);
  const [localEntries, setLocalEntries] = useState(computedTableData);

  const [localAmount, setLocalAmount] = useState(fullAmount);

  useEffect(() => {
    if (computedTableData !== localEntries) {
      setTableData(computedTableData);
      setLocalEntries(computedTableData);
    }
  }, [computedTableData, localEntries]);

  // Triggers `onUpdateData` prop event.
  const triggerUpdateData = useCallback((entries) => {
    onUpdateData && onUpdateData(entries);
  }, [onUpdateData]);

  useEffect(() => {
    if (localAmount !== fullAmount) {
      let _fullAmount = fullAmount;
      
      const newTableData = tableData.map((data) => {
        const amount = Math.min(data?.due_amount, _fullAmount);
        _fullAmount -= Math.max(amount, 0);

        return {
          ...data,
          payment_amount: amount,
        };
      });
      setTableData(newTableData);
      setLocalAmount(fullAmount);
      triggerUpdateData(newTableData);
    }
  }, [
    fullAmount,
    localAmount,
    tableData,
    triggerUpdateData,
  ]);
  
  // Fetches customer receivable invoices.
  const fetchCustomerDueInvoices = useQuery(
    ['customer-due-invoices', customerId],
    (key, _customerId) => requestFetchDueInvoices(_customerId),
    { enabled: isNewMode && customerId },
  );
  // No results message.
  const noResultsMessage = (customerId) ? 
    'There is no receivable invoices for this customer that can be applied for this payment' :
    'Please select a customer to display all open invoices for it.';

  const triggerOnFetchInvoicesSuccess = useCallback((bills) => {
    onFetchEntriesSuccess && onFetchEntriesSuccess(bills);
  }, [onFetchEntriesSuccess])

  // Handle update data.
  const handleUpdateData = useCallback((rows) => {
    triggerUpdateData(rows);
    setTableData(rows);
  }, [triggerUpdateData]);

  useEffect(() => {
    const enabled = isNewMode && customerId;

    if (!fetchCustomerDueInvoices.isFetching && enabled) {
      triggerOnFetchInvoicesSuccess(computedTableData);
    }
  }, [
    isNewMode,
    customerId,
    fetchCustomerDueInvoices.isFetching,
    computedTableData,
    triggerOnFetchInvoicesSuccess,
  ]);
 
  return (
    <CloudLoadingIndicator isLoading={fetchCustomerDueInvoices.isFetching}>
      <PaymentReceiveItemsTableEditor
        noResultsMessage={noResultsMessage}
        data={tableData}
        errors={errors}
        onUpdateData={handleUpdateData}
        onClickClearAllLines={onClickClearAllLines}
      />
    </CloudLoadingIndicator>
  );
}

export default compose(
  withInvoices(({ customerInvoiceEntries }) => ({
    customerInvoiceEntries,
  })),
  withInvoiceActions,
)(PaymentReceiveItemsTable);
