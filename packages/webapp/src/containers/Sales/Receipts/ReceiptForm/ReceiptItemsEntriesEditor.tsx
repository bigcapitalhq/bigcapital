// @ts-nocheck
import React from 'react';
import { x } from '@xstyled/emotion';
import { FastField } from 'formik';
import ItemsEntriesTable from '@/containers/Entries/ItemsEntriesTable';
import { useReceiptFormContext } from './ReceiptFormProvider';
import { entriesFieldShouldUpdate } from './utils';
import { TaxType } from '@/interfaces/TaxRates';
import { ITEM_TYPE } from '@/containers/Entries/utils';
import { ReceiptFormActions } from './ReceiptFormActions';

export default function ReceiptItemsEntriesEditor({ defaultReceipt }) {
  const { items, taxRates } = useReceiptFormContext();

  return (
    <x.div p="18px 32px 0">
      <ReceiptFormActions />
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
    </x.div>
  );
}
