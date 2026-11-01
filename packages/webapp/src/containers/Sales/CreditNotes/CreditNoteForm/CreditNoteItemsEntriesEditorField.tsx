import { FastField } from 'formik';
import React from 'react';
import { useCreditNoteFormContext } from './CreditNoteFormProvider';
import { entriesFieldShouldUpdate } from './utils';
import type { CreditNoteFormValues } from './utils';
import type { FieldProps } from 'formik';
import { Box } from '@/components';
import { ItemsEntriesTable } from '@/containers/Entries/ItemsEntriesTable';

/**
 * Credit note items entries editor field.
 */
export function CreditNoteItemsEntriesEditorField() {
  const { items } = useCreditNoteFormContext();

  return (
    <Box p="18px 32px 0">
      <FastField
        name={'entries'}
        items={items}
        shouldUpdate={entriesFieldShouldUpdate}
      >
        {({
          form: { values, setFieldValue },
          field: { value },
          meta: { error },
        }: FieldProps<any[], CreditNoteFormValues>) => (
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
    </Box>
  );
}
