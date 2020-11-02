import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Button, Intent, Position, Tooltip } from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import { Icon, CloudLoadingIndicator } from 'components';
import { useQuery } from 'react-query';
import { omit } from 'lodash';

import { compose, formattedAmount } from 'utils';

import withInvoices from '../Invoice/withInvoices';
import PaymentReceiveItemsTableEditor from './PaymentReceiveItemsTableEditor';
import withInvoiceActions from 'containers/Sales/Invoice/withInvoiceActions';


function PaymentReceiveItemsTable({
  // #ownProps
  paymentReceiveId,
  customerId,
  fullAmount,
  onUpdateData, 
  paymentEntries = [],// { invoice_id: number, payment_amount: number, id?: number }
  errors,
  onClickClearAllLines,

  // #withInvoices
  paymentReceiveReceivableInvoices,

  // #withPaymentReceive
  receivableInvoices,

  // #withPaymentReceiveActions
  requestFetchDueInvoices
}) {
  const isNewMode = !paymentReceiveId;

  const [tableData, setTableData] = useState([]);
  const [localAmount, setLocalAmount] = useState(fullAmount);

  const computedTableData = useMemo(() => {
    const entriesTable = new Map(
      paymentEntries.map((e) => [e.invoice_id, e]),
    );
    return receivableInvoices.map((invoice) => {
      const entry = entriesTable.get(invoice.id);

      return {
        invoice,
        id: null,
        payment_amount: 0,
        ...(entry || {}),
      };
    });
  }, [
    receivableInvoices,
    paymentEntries,
  ]);

  useEffect(() => {
    setTableData(computedTableData);
  }, [computedTableData]);

  // Triggers `onUpdateData` prop event.
  const triggerUpdateData = useCallback((entries) => {
    const _data = entries.map((entry) => ({
      invoice_id: entry?.invoice?.id,
      ...omit(entry, ['invoice']),
      due_amount: entry?.invoice?.due_amount,
    }))
    onUpdateData && onUpdateData(_data);
  }, [onUpdateData]);

  useEffect(() => {
    if (localAmount !== fullAmount) {
      let _fullAmount = fullAmount;
      
      const newTableData = tableData.map((data) => {
        const amount = Math.min(data?.invoice?.due_amount, _fullAmount);
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
  
  const fetchCustomerDueInvoices = useQuery(
    ['customer-due-invoices', customerId],
    (key, _customerId) => requestFetchDueInvoices(_customerId),
    { enabled: isNewMode && customerId },
  );
  // No results message.
  const noResultsMessage = (customerId) ? 
    'There is no receivable invoices for this customer that can be applied for this payment' :
    'Please select a customer to display all open invoices for it.';

  // Handle update data.
  const handleUpdateData = useCallback((rows) => {
    triggerUpdateData(rows);
  }, []);


  console.log(tableData, 'XX');

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
  withInvoices(({ paymentReceiveReceivableInvoices }) => ({
    receivableInvoices: paymentReceiveReceivableInvoices,
  })),
  withInvoiceActions,
)(PaymentReceiveItemsTable);
