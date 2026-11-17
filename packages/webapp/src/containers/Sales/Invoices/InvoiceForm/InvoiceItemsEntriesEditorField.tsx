import { FastField } from 'formik';
import React from 'react';
import { useInvoiceFormContext } from './InvoiceFormProvider';
import { entriesFieldShouldUpdate } from './utils';
import type { InvoiceFormValues } from './utils';
import type { FieldProps } from 'formik';
import { Features } from '@/constants';
import { ItemsEntriesTable } from '@/containers/Entries/ItemsEntriesTable';
import { ITEM_TYPE } from '@/containers/Entries/utils';
import { useFeatureCan } from '@/hooks/state';
import { TaxType } from '@/interfaces/TaxRates';

/**
 * Invoice items entries editor field.
 */
export function InvoiceItemsEntriesEditorField() {
  const { items, taxRates } = useInvoiceFormContext();
  const { featureCan } = useFeatureCan();
  const isBatchTrackingEnabled = featureCan(Features.BatchTracking);

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
        meta: { error },
      }: FieldProps<any[], InvoiceFormValues>) => (
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
          currencyCode={values.currencyCode}
          isInclusiveTax={values.inclusiveExclusiveTax === TaxType.Inclusive}
          batchMode={isBatchTrackingEnabled ? 'sale' : undefined}
        />
      )}
    </FastField>
  );
}
