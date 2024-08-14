// @ts-nocheck
import React from 'react';
import { useFormikContext } from 'formik';
import ClearingAllLinesAlert from '@/containers/Alerts/PaymentReceived/ClearingAllLinesAlert';
import { clearAllPaymentEntries } from './utils';

/**
 * Payment receive form alerts.
 */
export default function PaymentReceiveFormAlerts() {
  const { values: { entries }, setFieldValue } = useFormikContext();

  const handleClearingAllLines = () => {
    const newEntries = clearAllPaymentEntries(entries);
    setFieldValue('entries', newEntries);
    setFieldValue('full_amount', '');
  };

  return (
    <>
      <ClearingAllLinesAlert
        name={'clear-all-lines-payment-receive'}
        onConfirm={handleClearingAllLines}
      />
    </>
  );
}
