import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from 'react-query';
import { pick } from 'lodash';
import { LoadingIndicator, Choose } from 'components';
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
  vendorPayableBills,
  paymentMadePayableBills,

  // #withPaymentMadeDetail
  paymentMade,
}) {
  const [tableData, setTableData] = useState([]);
  const [localAmount, setLocalAmount] = useState(fullAmount);

  // Payable bills based on selected vendor or specific payment made.
  const payableBills = useMemo(
    () =>
      paymentMadeId
        ? paymentMadePayableBills
        : vendorId
        ? vendorPayableBills
        : [],
    [paymentMadeId, paymentMadePayableBills, vendorId, vendorPayableBills],
  );
  const isNewMode = !paymentMadeId;

  const triggerUpdateData = useCallback((data) => {
    onUpdateData && onUpdateData(data);
  }, [onUpdateData]);

  // Merges payment entries with payable bills.
  const computedTableData = useMemo(() => {
    const entriesTable = new Map(
      paymentEntries.map((e) => [e.bill_id, e]),
    );
    return payableBills.map((bill) => {
      const entry = entriesTable.get(bill.id);
      return {
        ...bill,
        bill_id: bill.id,
        bill_payment_amount: bill.payment_amount,
        payment_amount: entry ? entry.payment_amount : 0,
        id: entry ? entry.id : null,
      }
    });
  }, [paymentEntries, payableBills]);

  useEffect(() => {
    setTableData(computedTableData);
  }, [computedTableData]);

  // Handle
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

  return (
    <div>
      <LoadingIndicator loading={fetchVendorDueBills.isFetching}>
        <Choose>
          <Choose.When condition={tableData.length > 0}>
            <PaymentMadeItemsTableEditor
              data={tableData}
              errors={errors}
              onUpdateData={handleUpdateData}
              onClickClearAllLines={onClickClearAllLines}
            />
          </Choose.When>

          <Choose.Otherwise>The vendor has no due invoices.</Choose.Otherwise>
        </Choose>
      </LoadingIndicator>
    </div>
  );
}

export default compose( 
  withPaymentMadeActions,
  withBillActions,
  withBills(({ vendorPayableBills, paymentMadePayableBills }) => ({
    vendorPayableBills,
    paymentMadePayableBills,
  })),
)(PaymentMadeItemsTable);
