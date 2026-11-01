import { FastField } from 'formik';
import React from 'react';
import { PaymentReceiveItemsTable } from './PaymentReceiveItemsTable';
import type { PaymentReceiveEntry, PaymentReceiveFormValues } from './utils';
import { Box } from '@/components';

type FastFieldRenderProps = {
  form: {
    values: PaymentReceiveFormValues;
    setFieldValue: (field: string, value: unknown) => void;
  };
  field: { value: PaymentReceiveEntry[] };
};

/**
 * Payment Receive form body.
 */
export function PaymentReceiveFormBody() {
  return (
    <Box p="18px 32px 0">
      <FastField name={'entries'}>
        {({
          form: { values, setFieldValue },
          field: { value },
        }: FastFieldRenderProps) => (
          <PaymentReceiveItemsTable
            entries={value}
            onUpdateData={(newEntries: PaymentReceiveEntry[]) => {
              setFieldValue('entries', newEntries);
            }}
            currencyCode={values.currencyCode}
          />
        )}
      </FastField>
    </Box>
  );
}
