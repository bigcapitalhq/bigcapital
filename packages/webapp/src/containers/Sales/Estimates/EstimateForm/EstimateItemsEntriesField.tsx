// @ts-nocheck
import React from 'react';
import { x } from '@xstyled/emotion';
import { FastField } from 'formik';
import ItemsEntriesTable from '@/containers/Entries/ItemsEntriesTable';
import { useEstimateFormContext } from './EstimateFormProvider';
import { entriesFieldShouldUpdate } from './utils';

/**
 * Estimate form items entries editor.
 */
export default function EstimateFormItemsEntriesField() {
  const { items } = useEstimateFormContext();

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
