import { x } from '@xstyled/emotion';
import { FastField } from 'formik';
import React from 'react';
import { useEstimateFormContext } from './EstimateFormProvider';
import { entriesFieldShouldUpdate } from './utils';
import type { EstimateFormValues } from './utils';
import type { FieldProps } from 'formik';
import { ItemsEntriesTable } from '@/containers/Entries/ItemsEntriesTable';

/**
 * Estimate form items entries editor.
 */
export function EstimateFormItemsEntriesField() {
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
          meta: { error },
        }: FieldProps<any[], EstimateFormValues>) => (
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
