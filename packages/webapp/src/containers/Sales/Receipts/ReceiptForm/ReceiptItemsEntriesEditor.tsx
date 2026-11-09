import { x } from '@xstyled/emotion';
import { FastField } from 'formik';
import React from 'react';
import { useReceiptFormContext } from './ReceiptFormProvider';
import { entriesFieldShouldUpdate } from './utils';
import type { ReceiptFormValues } from './utils';
import type { FieldProps } from 'formik';
import { ItemsEntriesTable } from '@/containers/Entries/ItemsEntriesTable';

export function ReceiptItemsEntriesEditor() {
  const { items } = useReceiptFormContext();

  return (
    <x.div p="18px 32px 0">
      <FastField
        name={'entries'}
        items={items}
        shouldUpdate={entriesFieldShouldUpdate}
      >
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error },
        }: FieldProps<any[], ReceiptFormValues>) => (
          <ItemsEntriesTable
            value={value}
            onChange={(entries) => {
              setFieldValue('entries', entries);
            }}
            items={items}
            errors={error}
            linesNumber={4}
            currencyCode={values.currencyCode}
            enableTaxRates={false}
          />
        )}
      </FastField>
    </x.div>
  );
}
