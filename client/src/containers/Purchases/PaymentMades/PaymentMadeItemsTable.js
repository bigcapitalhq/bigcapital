import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from 'react-query';
import { omit } from 'lodash';
import { CloudLoadingIndicator } from 'components'
import PaymentMadeItemsTableEditor from './PaymentMadeItemsTableEditor';

import withPaymentMadeActions from './withPaymentMadeActions';
import withBillActions from '../Bill/withBillActions';
import withBills from '../Bill/withBills';

import { compose } from 'utils';

/**
 * Payment made items table.
 */
function PaymentMadeItemsTable({
  // #ownProps
  paymentMadeId,
  vendorId,
  fullAmount,
  onUpdateData,
  paymentEntries = [], // { bill_id: number, payment_amount: number, id?: number }
  onClickClearAllLines,
  errors,

  // #withBillActions
  requestFetchDueBills,

  // #withBills
  paymentMadePayableBills,

  // #withPaymentMadeDetail
  paymentMade,
}) {
  const [tableData, setTableData] = useState([]);
  const [localAmount, setLocalAmount] = useState(fullAmount);

  const isNewMode = !paymentMadeId;

  const triggerUpdateData = useCallback((entries) => {
    const _data = entries.map((entry) => ({
      bill_id: entry?.bill?.id,
      ...omit(entry, ['bill']),
    }))
    onUpdateData && onUpdateData(_data);
  }, [onUpdateData]);

  // Merges payment entries with payable bills.
  const computedTableData = useMemo(() => {
    const entriesTable = new Map(
      paymentEntries.map((e) => [e.bill_id, e]),
    );
    return paymentMadePayableBills.map((bill) => {
      const entry = entriesTable.get(bill.id);
      return {
        bill,
        id: null,
        payment_number: 0,
        ...(entry || {}),
      }
    });
  }, [paymentEntries, paymentMadePayableBills]);

  useEffect(() => {
    setTableData(computedTableData);
  }, [computedTableData]);

  // Handle mapping `fullAmount` prop to `localAmount` state.
  useEffect(() => {
    if (localAmount !== fullAmount) {
      let _fullAmount = fullAmount;
      const newTableData = tableData.map((data) => {
        const amount = Math.min(data.due_amount, _fullAmount);
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
    tableData,
    setTableData,
    setLocalAmount,
    triggerUpdateData,
    localAmount,
    fullAmount,
  ]);

  // Fetches vendor due bills.
  const fetchVendorDueBills = useQuery(
    ['vendor-due-bills', vendorId],
    (key, _vendorId) => requestFetchDueBills(_vendorId),
    { enabled: isNewMode && vendorId },
  );

  // Handle update data.
  const handleUpdateData = (rows) => {
    triggerUpdateData(rows);
  };

  const noResultsMessage = (vendorId) ?
    'There is no payable bills for this vendor that can be applied for this payment' : 
    'Please select a vendor to display all open bills for it.';

  return (
    <CloudLoadingIndicator isLoading={fetchVendorDueBills.isFetching}>
      <PaymentMadeItemsTableEditor
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
  withPaymentMadeActions,
  withBillActions,
  withBills(({ paymentMadePayableBills }) => ({
    paymentMadePayableBills,
  })),
)(PaymentMadeItemsTable);
