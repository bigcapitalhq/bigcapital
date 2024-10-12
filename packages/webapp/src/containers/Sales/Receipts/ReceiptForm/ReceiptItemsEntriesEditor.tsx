// @ts-nocheck
import React from 'react';
import { x } from '@xstyled/emotion';
import { FastField } from 'formik';
import ItemsEntriesTable from '@/containers/Entries/ItemsEntriesTable';
import { useReceiptFormContext } from './ReceiptFormProvider';
import { entriesFieldShouldUpdate } from './utils';

export default function ReceiptItemsEntriesEditor({ defaultReceipt }) {
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
          meta: { error, touched },
        }) => (
          <ItemsEntriesTable
            value={value}
            onChange={(entries) => {
              setFieldValue('entries', entries);
            }}
            items={items}
            errors={error}
            linesNumber={4}
            currencyCode={values.currency_code}
            enableTaxRates={false}
          />
        )}
      </FastField>
    </x.div>
  );
}
