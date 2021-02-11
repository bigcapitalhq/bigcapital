import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from 'react-query';
import { isEmpty } from 'lodash';
import { CloudLoadingIndicator } from 'components';
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
  onFetchEntriesSuccess,

  // #withBillActions
  requestFetchDueBills,

  // #withBills
  vendorPayableBillsEntries,
}) {
  const isNewMode = !paymentMadeId;

  // Detarmines takes vendor payable bills entries in create mode
  // or payment made entries in edit mode.
  const computedTableEntries = useMemo(
    () =>
      !isEmpty(paymentEntries)
        ? paymentEntries
        : (vendorPayableBillsEntries || []),
    [vendorPayableBillsEntries, paymentEntries],
  );
  const [tableData, setTableData] = useState(computedTableEntries);
  const [localEntries, setLocalEntries] = useState(computedTableEntries);

  const [localAmount, setLocalAmount] = useState(fullAmount);

  // Triggers `onUpdateData` event that passes changed entries.
  const triggerUpdateData = useCallback(
    (entries) => {
      onUpdateData && onUpdateData(entries);
    },
    [onUpdateData],
  );

  const triggerOnFetchBillsSuccess = useCallback(
    (bills) => {
      onFetchEntriesSuccess && onFetchEntriesSuccess(bills);
    },
    [onFetchEntriesSuccess],
  );

  useEffect(() => {
    if (computedTableEntries !== localEntries) {
      setTableData(computedTableEntries);
      setLocalEntries(computedTableEntries);
    }
  }, [computedTableEntries, localEntries]);

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

  useEffect(() => {
    const enabled = isNewMode && vendorId;

    if (!fetchVendorDueBills.isFetching && enabled) {
      triggerOnFetchBillsSuccess(computedTableEntries);
    }
  }, [
    vendorId,
    isNewMode,
    fetchVendorDueBills.isFetching,
    computedTableEntries,
    triggerOnFetchBillsSuccess,
  ]);

  // Handle update data.
  const handleUpdateData = useCallback(
    (rows) => {
      setTableData(rows);
      triggerUpdateData(rows);
    },
    [setTableData, triggerUpdateData],
  );

  // Detarmines the right no results message before selecting vendor and aftering
  // selecting vendor id.
  const noResultsMessage = vendorId
    ? 'There is no payable bills for this vendor that can be applied for this payment'
    : 'Please select a vendor to display all open bills for it.';

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
  withBills(({ paymentMadePayableBills, vendorPayableBillsEntries }) => ({
    paymentMadePayableBills,
    vendorPayableBillsEntries,
  })),
)(PaymentMadeItemsTable);
