// @ts-nocheck
import React from 'react';
import { FastField } from 'formik';
import ItemsEntriesTable from '@/containers/Entries/ItemsEntriesTable';
import { useCreditNoteFormContext } from './CreditNoteFormProvider';
import { entriesFieldShouldUpdate } from './utils';
import { Box } from '@/components';

/**
 * Credit note items entries editor field.
 */
export default function CreditNoteItemsEntriesEditorField() {
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
    </Box>
  );
}
