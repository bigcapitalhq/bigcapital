// @ts-nocheck
import React from 'react';
import { FastField } from 'formik';
import { x } from '@xstyled/emotion';
import ItemsEntriesTable from '@/containers/Entries/ItemsEntriesTable';
import { useInvoiceFormContext } from './InvoiceFormProvider';
import { entriesFieldShouldUpdate } from './utils';
import { TaxType } from '@/interfaces/TaxRates';
import { ITEM_TYPE } from '@/containers/Entries/utils';

/**
 * Invoice items entries editor field.
 */
export default function InvoiceItemsEntriesEditorField() {
  const { items, taxRates } = useInvoiceFormContext();

  return (
    <FastField
      name={'entries'}
      items={items}
      taxRates={taxRates}
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
          taxRates={taxRates}
          itemType={ITEM_TYPE.SELLABLE}
          errors={error}
          linesNumber={4}
          currencyCode={values.currency_code}
          isInclusiveTax={values.inclusive_exclusive_tax === TaxType.Inclusive}
        />
      )}
    </FastField>
  );
}
