// @ts-nocheck
import React from 'react';
import { FastField } from 'formik';
import PaymentReceiveItemsTable from './PaymentReceiveItemsTable';
import { Box } from '@/components';

/**
 * Payment Receive form body.
 */
export default function PaymentReceiveFormBody() {
  return (
    <Box p="18px 32px 0">
      <FastField name={'entries'}>
        {({ form: { values, setFieldValue }, field: { value } }) => (
          <PaymentReceiveItemsTable
            entries={value}
            onUpdateData={(newEntries) => {
              setFieldValue('entries', newEntries);
            }}
            currencyCode={values.currency_code}
          />
        )}
      </FastField>
    </Box>
  );
}
