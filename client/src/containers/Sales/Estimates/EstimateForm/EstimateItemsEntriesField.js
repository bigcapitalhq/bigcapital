import React from 'react';
import { FastField } from 'formik';
import ItemsEntriesTable from 'containers/Entries/ItemsEntriesTable';
import { useEstimateFormContext } from './EstimateFormProvider';

/**
 * Estimate form items entries editor.
 */
export default function EstimateFormItemsEntriesField() {
  const { items } = useEstimateFormContext();

  return (
    <FastField name={'entries'}>
      {({ form, field: { value }, meta: { error, touched } }) => (
        <ItemsEntriesTable
          entries={value}
          onUpdateData={(entries) => {
            form.setFieldValue('entries', entries);
          }}
          items={items}
          errors={error}
          linesNumber={4}
        />
      )}
    </FastField>
  );
}
